const { OpenAI } = require("openai")
const { DynamoDBClient, PutItemCommand  } = require("@aws-sdk/client-dynamodb");

const dynamo = new DynamoDBClient({});

console.log('Loading functions');

const openai = new OpenAI(
  {
    apiKey: process.env.OPENAI_API_KEY,
  }
);

exports.handler = async (event, context) => {
  const masterPrompt = process.env.WORRY_TIME_PROMPT
  const masterMessage = {role: "system", content: masterPrompt}
  console.log(event.body)

  const body = await JSON.parse(event.body)
  
  console.log(body)
  
  const cleanedMessages = body.messages.filter((message)=>message.role==="user"||message.role==="assistant")
  const userMessages = body.messages;
  console.log('Received message:', userMessages);

  let result
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [masterMessage, ...userMessages],
      max_tokens: 1024,
      temperature: 0,
    });
    console.log("Response from OpenAI API: ", response.choices[0].message);
    result = {statusCode: 200, body: JSON.stringify(response.choices[0].message)}
  } catch (error) {
    console.error("Error from OpenAI API: ", error);
    result = {statusCode: 500, body: JSON.stringify(error)}
  }
   
  // try {
  //   const conversationItem = {id_conversation:"01HBKFCFHCJ99FNEC73885Q6WG", unix_timestamp: 1696092037, master_prompt: "worry_time", user_messages: userMessages }  
  //   const conversationPutCommand = new PutItemCommand({TableName: "conversations", item: conversationItem})   
  //   await dynamo.send(conversationPutCommand)
  // } catch (error) {
  //   console.error("Error from DynamoDB: ", error)
  //   result = {statusCode: 500, body: JSON.stringify(error)}
  // }

  return result;
};
