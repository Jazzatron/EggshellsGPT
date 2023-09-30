const { OpenAI } = require("openai")
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {DynamoDBDocumentClient, PutCommand} = require("@aws-sdk/lib-dynamodb")

const dynamoClient = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(dynamoClient)

console.log('Loading functions');

const openai = new OpenAI(
  {
    apiKey: process.env.OPENAI_API_KEY,
  }
);

exports.handler = async (event, context) => {
  const masterPrompt = process.env.WORRY_TIME_PROMPT
  const masterMessage = {role: "system", content: masterPrompt}
  
  const cleanedMessages = event.messages.filter((message)=>message.role!=="system")
  const converstaionHistory = event.messages;
  
  if(!event.id_conversation || !event.unix_timestamp) {
    console.error("No missing id_conversation or unix_timestamp")
    throw Error("Bad request - missing properties")
  }

  let eggshellResponse
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [masterMessage, ...converstaionHistory],
      max_tokens: 1024,
      temperature: 0,
    });
    
    eggshellResponse = response.choices[0].message
  } catch (error) {
    console.error("Error from OpenAI API:", error);
    throw error   
  }
  
  try {
    const conversationItem = {id_conversation:event.id_conversation, unix_timestamp: event.unix_timestamp, master_prompt: "worry_time", user_messages: [...converstaionHistory, eggshellResponse]}  
    const conversationPutCommand = new PutCommand({TableName: "conversations", Item: conversationItem})   
    await dynamo.send(conversationPutCommand)
  } catch (error) {
    console.error("Error from DynamoDB: ", error)
  }

  return eggshellResponse;
};
