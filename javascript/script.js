const loginInput = document.querySelector(".login");
const passwordInput = document.querySelector(".password");
const regForm = document.querySelector(".registration-container");
const submitButton = document.querySelector(".submit");
const appContainer = document.querySelector(".application-container");
const chats = document.querySelector(".space-for-chats");
const appContainerMessages = document.querySelector(
  ".application-container_messages"
);
const errorMessage = document.querySelector(".error-message");
const regFormStyle = getComputedStyle(regForm, "display");

const CHATS_URL = "https://5f54ebb639221c00167fab9f.mockapi.io/chats";
const MESSAGES_URL = "https://5f54ebb639221c00167fab9f.mockapi.io/chats/";

chats.addEventListener("click", (e) => {
  const value = e.target.closest(".chat-container");
  if (value) {
    deleteActiveBlock();
    const id = +value.dataset.item + 1;
    const data = new GetData(`${MESSAGES_URL}${id}/messages`);
    data.getData().then((res) => {
      const messages = new MessageRender(res);
      messages.render();
      value.classList.add("active");
    });
  }
});
function deleteActiveBlock() {
  const activeBlock = document.querySelectorAll(".chat-container");
  activeBlock.forEach((item) => {
    item.classList.remove("active");
  });
}
submitButton.addEventListener("click", () => {
  if (loginInput.value.length > 3 && passwordInput.value.length > 3) {
    validateForm();
  } else {
    watchError();
  }
});

function validateForm() {
  const person = new Auth(loginInput.value, passwordInput.value);
  submitButton.innerHTML = `<div class="lds-dual-ring"></div>`;
  person
    .checkInputValue()
    .then(() => {
      regForm.style.display = "none";
      appContainer.style.display = "flex";
      init();
    })
    .catch(() => {
      watchError();
    })
    .finally(() => (submitButton.innerHTML = `Войти`));
}
function watchError() {
  errorMessage.style.display = "block";
  loginInput.style.border = "2px solid red";
  passwordInput.style.border = "2px solid red";
}

// Class Auth

const LOGIN = "admin";
const PASSWORD = "123456";

class Auth {
  constructor(login, password) {
    this.login = login;
    this.password = password;
  }
  checkInputValue() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.login === LOGIN && this.password === PASSWORD
          ? resolve()
          : reject();
      }, 3000);
    });
  }
}

class GetData {
  constructor(url) {
    this.url = url;
  }
  async getData() {
    const request = await fetch(this.url);
    return await request.json();
  }
}

class MessageRender {
  constructor(messages) {
    this.messages = messages;
  }
  render() {
    appContainerMessages.innerHTML = "";
    this.messages.forEach((item) => {
      appContainerMessages.insertAdjacentHTML(
        "beforeend",
        `
        <div class="message_content">
          <div class="message_photo">
            <img src="${item.avatar}" />
          </div>
          <div class="message_content_wrapper">
            <div class="message_name">${item.name}</div>
            <div class="message_text">${item.message}</div>
            <div class="message_date">${convertDate(
              item.createdAt,
              item.createdAt
            )}</div>
          </div>
          <div class="triangle"></div>
        </div>
        `
      );
    });
  }
}

// class render chat

class ChatRender {
  generateChat() {
    const data = new GetData(CHATS_URL);
    const chatsData = data.getData();

    chatsData.then((value) => {
      for (let i = 0; i < value.length; i++) {
        const chatContainer = document.createElement("div");
        chatContainer.classList.add("chat-container");
        chatContainer.dataset.item = i;
        this.renderPhoto(value[i], chatContainer);

        const containerInfoMessage = document.createElement("div");
        containerInfoMessage.classList.add("chat-info-message");

        const chatInfo = document.createElement("div");
        chatInfo.classList.add("chat-info");

        this.renderName(value[i], chatInfo);
        this.renderChatDate(value[i], chatInfo);

        containerInfoMessage.append(chatInfo);
        chatContainer.append(containerInfoMessage);

        this.renderMessage(value[i], containerInfoMessage);

        document.querySelector(".space-for-chats").append(chatContainer);
      }
    });
  }

  renderPhoto(chat, container) {
    const chatPhoto = document.createElement("div");
    chatPhoto.classList.add("chat-photo");
    chatPhoto.innerHTML = "<img src='" + chat.avatar + "'>";
    container.append(chatPhoto);
  }

  renderChatDate(chatdate, container) {
    const chatDate = document.createElement("div");
    chatDate.classList.add("chat-date");
    chatDate.innerHTML = convertDate(chatdate.messages[0].createdAt);
    container.append(chatDate);
  }
  renderName(chatname, containerinfo) {
    const chatSender = document.createElement("div");
    chatSender.classList.add("chat-sender");
    chatSender.innerHTML = chatname.name;
    containerinfo.append(chatSender);
  }

  renderMessage(message, container) {
    const chatMessage = document.createElement("div");
    chatMessage.classList.add("chat-message");
    chatMessage.innerHTML = message.messages[0].message;
    container.append(chatMessage);
  }
}

function convertDate(date, showTime = false) {
  let originalDate = new Date(Date.parse(date));
  let year = originalDate.getFullYear();
  let day = originalDate.getDate();
  let monthA = "Jan,Feb,Mar,Apr, May, June, July, Aug, Sept, Oct, Nov, Dec".split(
    ","
  );
  let month = monthA[originalDate.getMonth() - 1];
  let hour = originalDate.getHours();
  let minutes = originalDate.getMinutes();
  let convertedDate = `${month} ${day} ${year}`;

  if (showTime) {
    return `${hour}:${minutes} ${convertedDate}`;
  }
  return convertedDate;
}

function init() {
  const chat = new ChatRender();
  chat.generateChat();
}

init();
