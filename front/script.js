let myUserName = "";
let suisJeConnecte = false;

const socket = io.connect("http://localhost:3000");

socket.on("userdisconnect", () => {
  updateListUsers();
});

socket.on("userconnect", () => {
  if(suisJeConnecte) updateListUsers();
});

socket.on("vient-jouer", (msg) => {
  console.log(msg)
});

let btnSeConnecter = document.querySelector("#seconnecter");

btnSeConnecter.addEventListener("click", () => {
  let name = document.querySelector("#name").value;
  myUserName = name;
  let data = { "name": name, "socketId": socket.id };
  let headers = {
    "Content-Type": "application/json",
  }
  fetch("http://localhost:3000/", {
    method: "POST",
    headers: headers,
    body:  JSON.stringify(data)
  })
  .then((dataRecuDuServeur) => {
    if (dataRecuDuServeur.status == 201) {
      suisJeConnecte = true;
      document.querySelector("#form-pseudo").style.display = "none";
      socket.emit("userconnect");
    } else {
      document.querySelector('#pseudo-existe-deja').style.display = "block";
    }
  });
})

function updateListUsers() {
  cacherMessage();
  let usersListElement = document.querySelector("#list-users");
  fetch("http://localhost:3000/")
  .then(res => res.json())
  .then(users => {
    if(myUserName !== "") {
      users = users.filter(user => user.name !== myUserName);
    }
    users = users.filter(user => user.name !== user.socketId);
    viensJouer(users);
    if(users.length == 0) {
      document.querySelector("#message-si-liste-vide").style.display = "block";
    } else {
      let usersLis = users.map(user => `
        <li class="user-item">${user.name}, score: ${user.score}</li>
      `)
      usersListElement.innerHTML = usersLis.join("");
    }
  })
}

function cacherMessage() {
  document.querySelector("#pseudo-existe-deja").style.display = "none";
  document.querySelector("#message-si-liste-vide").style.display = "none";
}

function viensJouer(users) {
  let userConnected = users.filter(u => u.isConnected === true)[0];
  if(userConnected?.isConnected && suisJeConnecte) { // ecarter undefined et null + verifier si isConnected existe + moi je suis connecte
    socket.emit("vient-jouer", {expediteur: socket.id, recepteur: userConnected.socketId});
  }
}