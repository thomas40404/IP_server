let servers = JSON.parse(localStorage.getItem("servers")) || [];

const serversBox = document.getElementById("servers");

const popup = document.getElementById("popup");
const openPopup = document.getElementById("open-popup");
const closePopup = document.getElementById("popup-close");
const popupAdd = document.getElementById("popup-add");
const popupIp = document.getElementById("popup-ip");
const popupPort = document.getElementById("popup-port");
const popupImg = document.getElementById("popup-img");

function save() {
    localStorage.setItem("servers", JSON.stringify(servers));
}

function render() {
    serversBox.innerHTML = "";

    servers.forEach((srv, index) => {
        const div = document.createElement("div");
        div.className = "card";

        let url = `http://${srv.ip}`;
        if (srv.port) url += `:${srv.port}`;

        div.innerHTML = `
            <a href="${url}" target="_blank">
                <img src="${srv.image}" onerror="this.style.opacity=0.5;this.alt='Image introuvable'" />
                <div class="card-ip">${srv.ip}:${srv.port || ''}</div>
            </a>
            <div class="card-buttons">
                <button class="btn btn-edit" onclick="editServer(${index})">Edit</button>
                <button class="btn btn-del" onclick="deleteServer(${index})">Del</button>
            </div>
        `;

        serversBox.appendChild(div);
    });
}

function addServer(ip, port, img) {
    if (!ip || !img) return;
    servers.push({ ip, port, image: img });
    save();
    render();
}

// popup handlers
openPopup.addEventListener("click", () => {
    popup.style.display = "flex";
    popupIp.focus();
});
closePopup.addEventListener("click", () => {
    popup.style.display = "none";
    popupIp.value = "";
    popupPort.value = "";
    popupImg.value = "";
});
popupAdd.addEventListener("click", () => {
    const ip = popupIp.value.trim();
    const port = popupPort.value.trim();
    const img = popupImg.value.trim();
    if (!ip || !img) return alert("IP, port et Image sont requises");
    addServer(ip, port, img);
    popup.style.display = "none";
    popupIp.value = "";
    popupPort.value = "";
    popupImg.value = "";
});

function editServer(i) {
    const newIp = prompt("Nouvelle IP :", servers[i].ip);
    const newPort = prompt("Nouveau port :", servers[i].port || "");
    const newImg = prompt("Nouvelle image :", servers[i].image);
    if (newIp !== null) servers[i].ip = newIp;
    if (newPort !== null) servers[i].port = newPort;
    if (newImg !== null) servers[i].image = newImg;
    save();
    render();
}

function deleteServer(i) {
    if (confirm("Supprimer ce serveur ?")) {
        servers.splice(i, 1);
        save();
        render();
    }
}

// initial render
render();