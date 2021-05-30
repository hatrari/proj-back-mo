const socket = io.connect("http://localhost:3000");

socket.on("userdisconnect", () => {
  updateListUsers();
});

socket.on("userconnect", () => {
  updateListUsers();
});

let myUserName;

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