const chatInput = document.getElementById("chat-input");
const chatHistory = document.getElementById("chat-history");
let pastPrompts = []; 

const id_conversation = ULID.ulid()
const unix_timestamp = Date.now()

document.querySelector("\#worrytimeButton").classList.add('bold'); 

async function sendMessage() {
  if (chatInput.value) {
    //Disable chat input when waiting for response
    let chatInput = document.querySelector('#chat-input');
    chatInput.disabled=true;
    chatInput.placeholder = "Waiting for Eggbert to respond...";
    
    //Put user input into chatbox
    var userMessage = document.createElement("p");
    userMessage.textContent = chatInput.value;
    chatHistory.appendChild(userMessage);
    chatHistory.scrollTop = chatHistory.scrollHeight;

    pastPrompts.push({role: "user", content: chatInput.value});
    try {
      const response = await fetch("https://xg1vey3un4.execute-api.eu-north-1.amazonaws.com/default/callEggshellsGPT2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: pastPrompts,
          id_conversation,
          unix_timestamp
        }),
      })

      const parsedResponse = await response.json()
      
      //Put AI response in chatbox, if you get one
      var chatbotMessage = document.createElement("p");

      if(!parsedResponse.content) {
        throw Error("No content from Eggbert")
      } 

      chatbotMessage.textContent = parsedResponse.content

      pastPrompts.push({role:"assistant", content:chatbotMessage.textContent});
      chatHistory.scrollTop = chatHistory.scrollHeight;

    } catch(error) {
        //AI response if error
        var chatbotMessage = document.createElement("p");
        chatbotMessage.textContent =
          "Whoops, I'm busy right now. Can you try again in a minute?";

        console.error(error);
      };

      chatHistory.appendChild(chatbotMessage);
      chatbotMessage.style.color = "#EB9600";
      chatHistory.scrollTop = chatHistory.scrollHeight;
      chatInput.disabled=false;
      chatInput.placeholder = "Enter your message here";

    chatInput.value = "";
  }
}

//user can submit input using enter key
document.querySelector("#send-button").addEventListener("click", sendMessage);
chatInput.addEventListener("keydown", (e) => {
  if (e.key == "Enter") sendMessage();
});

