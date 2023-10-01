
const chatInput = document.getElementById("chat-input");
const chatHistory = document.getElementById("chat-history");
let pastPrompts = []; 

let worrytimePrompt = "Be really compassionate in your tone, pretend you are a coach that is also trained as a compassion focused therapist. You are the AI, only ever complete the AI's part of the conversation. Guide the user through the technique, worry time. Behave like a socratic tutor. Start by asking them to name one worry, say this in your first message. Ask them to decide whether their worry is practical or not (can they do anything about it?), help them figure that out. Then if it is practical, ask them what they can do to solve it. If you ever offer any of your own suggestions, say something like “something that sometimes works for people is … what do you think?”. Keep your answers short, 3-5 lines max. Keep on topic gently. For each worry, if you problem solve, be direct and do not spend too long problem-solving!!!! If they can’t do anything about the worry, ask them if they are ok letting it go and moving on. Try not to be pushy. Be gentle."

let permanentPrompt = worrytimePrompt; 
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
          id_conversation: "bleurgh",
          unix_timestamp: 1696092038
        }),
      })

      const parsedResponse = await response.json()
      console.log('Response',parsedResponse)
          //Put AI response in chatbox, if you get one
          var chatbotMessage = document.createElement("p");

          chatbotMessage.textContent =
          parsedResponse.content ??
            "Whoops, I'm busy right now. Can you try again in a minute?"; //AI response if error
          
          chatHistory.appendChild(chatbotMessage);
          !!parsedResponse.content && pastPrompts.push(chatbotMessage.textContent);
          chatHistory.scrollTop = chatHistory.scrollHeight;
  
          //Enable chat input after response
    } catch(error) {
        //AI response if error
        var chatbotMessage = document.createElement("p");
        chatbotMessage.textContent =
          "Whoops, I'm busy right now. Can you try again in a minute?";

        console.error(error);
      };

      chatbotMessage.style.color = "#EB9600";
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

