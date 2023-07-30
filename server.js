const express = require("express");
const { config } = require("dotenv");
const { Configuration, OpenAIApi } = require("openai");

// Load environment variables from .env file
config();

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

const app = express();
const port = 3000;

app.use(express.json());
app.use(require("cors")());

app.post("/api/gpt-3", async (req, res) => {
  const userMessage = req.body.message;
  console.log('Received message:', userMessage);

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: userMessage }],
      max_tokens: 1024,
      temperature: 0,
    });
    console.log("Response from OpenAI API:", response);
    res.json(response.data);
  } catch (error) {
    console.error("Error from OpenAI API:", error);
    res.status(500).json({ error: error.toString() });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

