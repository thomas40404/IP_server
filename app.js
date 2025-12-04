let servers = JSON.parse(localStorage.getItem("servers")) || [];

const serversBox = document.getElementById("servers");

const popup = document.getElementById("popup");
const openPopup = document.getElementById("open-popup");
const closePopup = document.getElementById("popup-close");
const popupAdd = document.getElementById("popup-add");
const popupUrl = document.getElementById("popup-ip");
const popupImg = document.getElementById("popup-img");

function save() {
    localStorage.setItem("servers", JSON.stringify(servers));
}

function extractLocalIPSuffix(url) {
    try {
        // ajouter http:// si nécessaire
        let tempUrl = url;
        if (!/^https?:\/\//i.test(url)) {
            tempUrl = 'http://' + url;
        }

        const u = new URL(tempUrl);
        const host = u.hostname;

        if (host.startsWith("192.168.0.")) {
            let suffix = host.substring("192.168.0.".length);
            // garder tous les chiffres jusqu'au premier non-chiffre ou fin
            let result = '';
            for (let i = 0; i < suffix.length; i++) {
                if (/\d/.test(suffix[i])) result += suffix[i];
                else break;
            }
            return result;
        }
    } catch(e) {
        return '';
    }
    return '';
}

function render() {
    serversBox.innerHTML = "";

    servers.forEach((srv, index) => {
        const div = document.createElement("div");
        div.className = "card";

        let url = srv.url;
        const ipLabel = extractLocalIPSuffix(url);

        div.innerHTML = `
            <a href="${url}" target="_blank">
                <img src="${srv.image}" onerror="this.style.opacity=0.5;this.alt='Image introuvable'" />
                <div class="card-ip">${ipLabel}</div>
            </a>
            <div class="card-buttons">
                <button class="btn btn-edit" onclick="editServer(${index})">Edit</button>
                <button class="btn btn-del" onclick="deleteServer(${index})">Del</button>
            </div>
        `;

        serversBox.appendChild(div);
    });
}

function addServer(url, img) {
    if (!url || !img) return;
    servers.push({ url, image: img });
    save();
    render();
}

// popup handlers
openPopup.addEventListener("click", () => {
    popup.style.display = "flex";
    popupUrl.focus();
});
closePopup.addEventListener("click", () => {
    popup.style.display = "none";
    popupUrl.value = "";
    popupImg.value = "";
});
popupAdd.addEventListener("click", () => {
    const url = popupUrl.value.trim();
    const img = popupImg.value.trim();
    if (!url || !img) return alert("URL et image sont requises");
    addServer(url, img);
    popup.style.display = "none";
    popupUrl.value = "";
    popupImg.value = "";
});

function editServer(i) {
    const newUrl = prompt("Nouvelle URL :", servers[i].url);
    const newImg = prompt("Nouvelle image :", servers[i].image);
    if (newUrl !== null) servers[i].url = newUrl;
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