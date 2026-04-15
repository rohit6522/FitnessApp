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