const API_URL = "http://localhost:3000/bark";
const barkContainer = document.querySelector(".bark_container");
const createBarkForm = document.querySelector(".bark_form");

createBarkForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    let formData = new FormData(createBarkForm);
    let payLoad = {
        name: formData.get("name"),
        content: formData.get("content"),
    };
    let response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payLoad),
    });

    if (response.status == 200) {
        createBarkForm.reset();
        getAllBarks();
    } else {
        console.error(response.statusText);
        return;
    }
});

async function getAllBarks() {
    let response = await fetch(API_URL);
    let barks = await response.json();
    displayBarks(barks);

}

async function getBarksByTags(tag) {
    let response = await fetch(API_URL + `?tags=${tag}`);
    let barks = await response.json();

}

async function getBarksByName(name) {
    let response = await fetch(API_URL + `?name=${name}`);
    let barks = await response.json();
}

function displayBarks(data) {
    if (!data || !data.barks || data.barks.length === 0) {
        console.log("error");
        // No barks or invalid data, return or display a message
    }
    barkContainer.innerHTML = "";

    data.barks.forEach((record) => {
        let bark = document.createElement("div");
        bark.classList.add("bark");

        let name = document.createElement("h3");
        name.textContent = record.name;

        let barkContent = document.createElement("div");
        barkContent.classList.add("bark_content");

        let content = document.createElement("p");
        content.textContent = record.content;
        barkContent.appendChild(content);

        let date = document.createElement("span");
        date.textContent = new Date(record.createdAt).toDateString();
        date.classList.add("date");
        barkContent.appendChild(date);

        bark.appendChild(name);
        bark.appendChild(barkContent);

        barkContainer.appendChild(bark);
    });
}


getAllBarks();