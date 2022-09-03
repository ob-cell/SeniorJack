// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBqH0SGtaYryrAbeJ5gNQPQqLeaMIB6ie0",
  authDomain: "theultimatechatbox.firebaseapp.com",
  databaseURL: "https://theultimatechatbox-default-rtdb.firebaseio.com",
  projectId: "theultimatechatbox",
  storageBucket: "theultimatechatbox.appspot.com",
  messagingSenderId: "862436901788",
  appId: "1:862436901788:web:33b0a1e352a8d68aecbe59",
  measurementId: "G-MKPKW85DL3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const username = prompt("Hello and welcome! What's your nickname?");

document.getElementById("send-message").addEventListener("submit", postChat);
function postChat(e) {
  e.preventDefault();
  const timestamp = Date.now();
  const chatTxt = document.getElementById("chat-txt");
  const message = chatTxt.value;
  chatTxt.value = "";
  db.ref("messages/" + timestamp).set({
    usr: username,
    msg: message,
  });
}

const fetchChat = db.ref("messages/");
fetchChat.on("child_added", function (snapshot) {
  const messages = snapshot.val();
  const msg = "<li>" + messages.usr + " : " + messages.msg + "</li>";
  document.getElementById("messages").innerHTML += msg;
});
