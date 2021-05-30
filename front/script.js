const URL_API = "http://192.168.1.186:3000"
let myUserName = "";
let suisJeConnecte = false;

const socket = io.connect(URL_API);

socket.on("userdisconnect", () => {
  updateListUsers();
});

socket.on("userconnect", () => {
  if(suisJeConnecte) updateListUsers();
});

socket.on("vient-jouer", (msg) => {
  let message = document.querySelector("#message-viens-jour");
  if(msg.expediteur !== socket.id && suisJeConnecte) {
    let compteur = 5;
    let intervalId = setInterval(() => {
      if(compteur == 1) clearInterval(intervalId);
      compteur--;
      message.innerHTML = `${msg.expediteurName} vous invite a jouer. <br>
      la partie commence dans <span>${compteur}</span>s`;
    }, 1000);
    setTimeout(() => {
      document.querySelector("#list-users").style.display = "none";
      document.querySelector("#jeu").style.display = "block";
      message.innerHTML = "";
    }, 5000);
  }
});

let btnSeConnecter = document.querySelector("#seconnecter");

btnSeConnecter.addEventListener("click", () => {
  let name = document.querySelector("#name").value;
  myUserName = name;
  let data = { "name": name, "socketId": socket.id };
  let headers = {
    "Content-Type": "application/json",
  }
  fetch(URL_API, {
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
  fetch(URL_API)
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
    socket.emit("vient-jouer", {
      expediteur: socket.id,
      expediteurName: myUserName,
      recepteur: userConnected.socketId,
    });
  }
}

let btnEnvoyerLettreProposee = document.querySelector("#envoyerLettreProposee");

btnEnvoyerLettreProposee.addEventListener("click", () => {
  let lettreProposee = document.querySelector("#lettreProposee").value;
  socket.emit("proposer-lettre", {
    expediteur: socket.id,
    lettreProposee: lettreProposee
  });
});

socket.on("proposer-lettre", (msg) => {
  if(msg.expediteur !== socket.id) {
    console.log(msg.lettreProposee)
  }
});