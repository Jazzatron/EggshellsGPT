
const chatInput = document.getElementById("chat-input");
const chatHistory = document.getElementById("chat-history");
let pastPrompts = []; 

let worrytimePrompt = "Be really compassionate in your tone, pretend you are a coach that is also trained as a compassion focused therapist. You are the AI, only ever complete the AI's part of the conversation. Guide the user through the technique, worry time. Behave like a socratic tutor. Start by asking them to name one worry, say this in your first message. Ask them to decide whether their worry is practical or not (can they do anything about it?), help them figure that out. Then if it is practical, ask them what they can do to solve it. If you ever offer any of your own suggestions, say something like “something that sometimes works for people is … what do you think?”. Keep your answers short, 3-5 lines max. Keep on topic gently. For each worry, if you problem solve, be direct and do not spend too long problem-solving!!!! If they can’t do anything about the worry, ask them if they are ok letting it go and moving on. Try not to be pushy. Be gentle."
let cheerleadingPrompt = "Be really compassionate in your tone, pretend you are a confidence building coach that is also trained as a compassion focused therapist. You are the AI, only ever complete the AI's part of the conversation. You are also a socratic tutor. You are here to help a student identify their strengths, appreciate their strengths and find ways to use their strengths more. Stay on topic. Ask them questions so that they identify their own strengths. Take it one strength at a time. When you have done this, try again to find a new unrelated strength. Try to let them identify their strengths. When converting what they are saying into a conrete strength, always ask if they agree that something is a strength before appreciating it and helping them find ways to use their strengths more. Keep your answers short, 3-5 lines max. Don't spend ages discussing how to use the skill in their life. ";
let compassionatePrompt = "Be really compassionate in your tone, pretend you are a coach that is also trained as a compassion focused therapist. You are the AI, only ever complete the AI's part of the conversation. You *never* give the student the answer, but always try to ask just the right question to help them learn to think for themselves. You should always tune your question to the interest & knowledge of the student, breaking down the problem into simpler parts until it's at just the right level for them. You should be empathetic and compassionate in every message. You are here to help a student be compassionate towards themselves, start by asking them about a time when they have felt angry towards themselves or like they didn't do a good enough job. Stay on topic. To help, ask them questions like: are you condemning yourself as a total person on the basis of a single event, are you focusing on your weaknesses and forgetting your strengths, are you exaggerating the importance of events, are you over-estimating the changes of a disaster, are you expecting to be perfect, etc. etc. You can also help them think of alternative views - perhaps by asking them to reflect on how a friend might view this situation and what evidence they may have to back that. Above all, you are helping them be more compassionate and caring towards themselves using principles from compassionate focused therapy. Keep your answers short, 3-5 lines max. "; 


let permanentPrompt = worrytimePrompt; 
document.querySelector("\#worrytimeButton").classList.add('bold'); 

function changePermanentPrompt(newValue, btnId) {
  permanentPrompt = newValue; 
  document.querySelector("\#worrytimeButton").classList.remove('bold'); 
  document.querySelector("\#strengthsButton").classList.remove('bold'); 
  document.querySelector("\#compassionButton").classList.remove('bold');
  document.querySelector(btnId).classList.add('bold');  

  chatHistory.innerHTML = ''; 
  pastPrompts = []; 
}

document.querySelector("\#worrytimeButton").addEventListener('click', function () {
  changePermanentPrompt(worrytimePrompt,"\#worrytimeButton");
});
document.querySelector("\#strengthsButton").addEventListener('click', function () {
  changePermanentPrompt(cheerleadingPrompt,"\#strengthsButton");
});
document.querySelector("\#compassionButton").addEventListener('click', function() {
  changePermanentPrompt(compassionatePrompt,"\#compassionButton");
});





function sendMessage() {
  if (chatInput.value) {
    //Disable chat input when waiting for response
    let chatInput = document.querySelector('#chat-input');
    chatInput.disabled=true;
    chatInput.placeholder = "Waiting for Eggbert to respond.. ";
    
    //Put user input into chatbox
    var userMessage = document.createElement("p");
    userMessage.textContent = chatInput.value;
    chatHistory.appendChild(userMessage);
    chatHistory.scrollTop = chatHistory.scrollHeight;

    //Store only the last 2 pairs of back and forth, as well as the most recent input
    pastPrompts.push(` User: ${chatInput.value} AI:`);
    while (pastPrompts.length >5) {
      pastPrompts.shift();
    }

    fetch("http://localhost:3000/api/gpt-3", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message:permanentPrompt + pastPrompts.join(""),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        //Put AI response in chatbox, if you get one
        var chatbotMessage = document.createElement("p");
        chatbotMessage.textContent =
          data?.choices?.[0]?.message?.content ??
          "Whoops, I'm busy right now. Can you try again in a minute?"; //AI response if error
        chatbotMessage.style.color = "#EB9600";
        //console.log(chatbotMessage.textContent);
        chatHistory.appendChild(chatbotMessage);
        pastPrompts.push(chatbotMessage.textContent);
        chatHistory.scrollTop = chatHistory.scrollHeight;

        //Enable chat input after response
        chatInput.disabled=false;
        chatInput.placeholder = "Enter your message here";
      })
      .catch((error) => {
        //AI response if error
        var chatbotMessage = document.createElement("p");
        chatbotMessage.textContent =
          "Whoops, I'm busy right now. Can you try again in a minute?";
        chatbotMessage.style.color = "#EB9600";
        chatHistory.appendChild(chatbotMessage);
        console.error(error);

        //Enable chat input after response
        chatInput.disabled=false;
        chatInput.placeholder = "Enter your message here";
      });

    chatInput.value = "";
  }
}

//user can submit input using enter key
document.querySelector("#send-button").addEventListener("click", sendMessage);
chatInput.addEventListener("keydown", (e) => {
  if (e.key == "Enter") sendMessage();
});

