const { GoogleGenerativeAI } = require("@google/generative-ai");

let genAI;

function getGeminiClient() {
    if (!genAI) {
        const apiKey = process.env.GEMINI_API_KEY;
        
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is missing. Please add it to your .env file.");
        }
        genAI = new GoogleGenerativeAI(apiKey);
    }
    return genAI;
}


exports.chat = async (req, res) => {
    try {
        const client = getGeminiClient();
        const { message, history } = req.body

        if (!message && !history) {
            return res.status(400).json({ error: "Message is required." });
        }

        const model = client.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: "You are a fitness coach chatbot. Give short and helpful answers."
        });

        let contents = [];

        if (history && Array.isArray(history)) {
            // 1. Map frontend format to Gemini format
            let mappedHistory = history.map(msg => ({
                role: msg.role === "assistant" ? "model" : "user",
                parts: [{ text: msg.content }]
            }));

            // 2. Gemini strict rule: History MUST start with a 'user' message.
            // If the chat starts with the bot's welcome message, remove it.
            while (mappedHistory.length > 0 && mappedHistory[0].role === "model") {
                mappedHistory.shift();
            }

            // 3. Gemini strict rule: Roles MUST strictly alternate (user -> model -> user).
            for (let i = 0; i < mappedHistory.length; i++) {
                const currentMsg = mappedHistory[i];
                const lastValidMsg = contents[contents.length - 1];
                
                if (!lastValidMsg || lastValidMsg.role !== currentMsg.role) {
                    contents.push(currentMsg);
                } else {
                    // If duplicate roles appear, merge their text into one message
                    lastValidMsg.parts[0].text += "\n" + currentMsg.parts[0].text;
                }
            }
        } else if (message) {
            contents = [{ role: "user", parts: [{ text: message }] }];
        }

        const result = await model.generateContent({ contents });
        const response = await result.response;
        
        res.json({ reply: response.text() })
    } catch (err) {
        console.error("Error in chat controller:", err); // Log the full error for better debugging
        res.status(500).json({ error: "Failed to communicate with the AI service. " + err.message })
    }
}

exports.generateWorkout = async (req, res) => {
    try {
        const client = getGeminiClient();
        const { prompt } = req.body;
        const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const fullPrompt = `You are an expert fitness coach. Create a workout plan based on this request: "${prompt}". 
        Return ONLY valid JSON with this exact structure, with no markdown code blocks around it: 
        { "name": "Workout Name", "type": "Strength", "exercises": [ { "name": "Exercise Name", "sets": 3, "reps": 12, "time": 0 } ] }`;
        
        const result = await model.generateContent(fullPrompt);
        let text = result.response.text().trim();
        
        // Clean up markdown formatting if Gemini includes it
        if (text.startsWith("```json")) text = text.replace(/^```json/, "");
        if (text.startsWith("```")) text = text.replace(/^```/, "");
        if (text.endsWith("```")) text = text.replace(/```$/, "");
        
        const plan = JSON.parse(text.trim());
        res.json(plan);
    } catch (err) {
        console.error("Generate Workout Error:", err);
        res.status(500).json({ error: "Failed to generate workout." });
    }
};

exports.generateMealPlan = async (req, res) => {
    try {
        const client = getGeminiClient();
        const { weight, goal, diet } = req.body;
        const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const prompt = `You are an expert nutritionist. I currently weigh ${weight}kg. My main fitness goal is "${goal}". 
        My dietary preference is ${diet}. 
        Please generate a highly structured, concise 7-day meal plan for me. Include breakfast, lunch, and dinner. 
        Format it beautifully using markdown with emojis. Do not make it too long.`;
        
        const result = await model.generateContent(prompt);
        res.json({ mealPlan: result.response.text() });
    } catch (err) {
        console.error("Meal Plan Error:", err);
        res.status(500).json({ error: "Failed to generate meal plan." });
    }
};