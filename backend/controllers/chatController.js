const OpenAI = require("openai")

let openai;

// Lazily initialize the OpenAI client to prevent startup crashes if the API key is missing.
function getOpenAIClient() {
    if (!openai) {
        if (!process.env.GROQ_API_KEY) {
            throw new Error("The GROQ_API_KEY environment variable is missing or empty.");
        }
        openai = new OpenAI({
            apiKey: process.env.GROQ_API_KEY,
            baseURL: "https://api.groq.com/openai/v1", // Point the OpenAI SDK to Groq
        });
    }
    return openai;
}


exports.chat = async (req, res) => {
    try {
        const openaiClient = getOpenAIClient();
        const { message } = req.body

        if (!message) {
            return res.status(400).json({ error: "Message is required." });
        }

        const completion = await openaiClient.chat.completions.create({

            model: "llama3-8b-8192",
            // Use Groq's fast LLaMA 3 model
            messages: [
                { role: "system", content: "You are a fitness coach chatbot. Give short and helpful answers." },
                { role: "user", content: message }
            ]
        })

        res.json({ reply: completion.choices[0].message.content })
    } catch (err) {
        console.error("Error in chat controller:", err); // Log the full error for better debugging
        res.status(500).json({ error: "Failed to communicate with the AI service. " + err.message })
    }
}