//TO DO: make this work for the enter button too
const chatInput = document.getElementById("chat-input");
const chatHistory = document.getElementById("chat-history");
let previousPrompts =
  "You are a tutor that always responds in the Socratic style. You *never* give the student the answer, but always try to ask just the right question to help them learn to think for themselves. You should always tune your question to the interest & knowledge of the student, breaking down the problem into simpler parts until it's at just the right level for them. You should be empathetic and compassionate in every message. Here is the previous conversation history, up until the latest question asked. ";

function sendMessage() {
  if (chatInput.value) {
    var userMessage = document.createElement("p");
    userMessage.textContent = chatInput.value;
    chatHistory.appendChild(userMessage);
    previousPrompts += ` User: ${chatInput.value} AI:`;

    fetch("http://localhost:3000/api/gpt-3", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: previousPrompts,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        var chatbotMessage = document.createElement("p");
        chatbotMessage.textContent =
          data?.choices?.[0]?.message?.content ??
          "Whoops, I'm busy right now. Can you try again in a minute?";
        chatbotMessage.style.color = "#EB9600";
        chatHistory.appendChild(chatbotMessage);
        previousPrompts += chatbotMessage.textContent;
      })
      .catch((error) => {
        var chatbotMessage = document.createElement("p");
        chatbotMessage.textContent =
          "Whoops, I'm busy right now. Can you try again in a minute?";
        chatbotMessage.style.color = "#EB9600";
        chatHistory.appendChild(chatbotMessage);
        console.error(error);
      });

    chatInput.value = "";
  }
}

document.querySelector("#send-button").addEventListener("click", sendMessage);
chatInput.addEventListener("keydown", (e) => {
  if (e.key == "Enter") sendMessage();
});

