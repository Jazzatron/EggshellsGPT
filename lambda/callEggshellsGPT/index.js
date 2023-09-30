const { OpenAI } = require("openai")
console.log('Loading functions');

const openai = new OpenAI(
  {
    apiKey: process.env.OPENAI_API_KEY,
  }
);

exports.handler = async (event, context) => {
  const masterPrompt = process.env.WORRY_TIME_PROMPT
  const masterMessage = {role: "system", content: masterPrompt}
  console.log("Event: ", event)
  
  const cleanedMessages = event.messages.filter((message)=>message.role!=="system")
  const userMessages = event.messages;
  console.log('Received message:', userMessages);

  let response
  try {
    response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [masterMessage, ...userMessages],
      max_tokens: 1024,
      temperature: 0,
    });
    console.log("Response from OpenAI API:", response.choices[0].message);
  } catch (error) {
    console.error("Error from OpenAI API:", error);
    throw error
  }
    
  const result = response.choices[0].message
  return result;
};
