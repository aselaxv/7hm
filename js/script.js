const postContainer = document.getElementById("posts-container");
const filter = document.getElementById("filter");
const loader = document.querySelector(".loader");

let limit = 5;
let page = 1;

const dataFromBack = []
let loadingIndicate = false;

let oldDataLength = dataFromBack.length
let newDataLength;


async function getPosts() {
    oldDataLength = dataFromBack.length
    const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`
    );
    const data = await response.json();
    console.log(data);
    page++;

    for (let key in data) {
        dataFromBack.push(data[key]);
    }
    newDataLength = dataFromBack.length
    return data;
}

function renderItem({ title, body, id }) {
    return `
    <div class = "post">
        <div class = "number">${id}</div>
        <div class = "post-info">
        <h2 class = "post-title">${title}</h2>
        <p class = "post-body">${body}</p>
        </div>
    </div>
     `;
}

function renderAllItems(items, renderFunction) {
    let text = "";

    for (let key in items) {
        text += renderFunction(items[key]);
    }

    return text;
}

async function renderPosts() {
    const posts = await getPosts();
    postContainer.innerHTML += renderAllItems(posts, renderItem);
}

function showLoading() {
    loadingIndicate = true;
    loader.classList.toggle("show");

    renderPosts().finally(() => {
        loadingIndicate = false;
        loader.classList.toggle("show");
    });
}

window.addEventListener("scroll", () => {
    if (oldDataLength === newDataLength) {
        return;
    }

    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight - 5 && !loadingIndicate) {
        console.log("end");
        showLoading();
    }
})


function searchPosts(text) {
    const term = text.toLowerCase();
    const filteredPosts = dataFromBack.filter(({ title, id, body }) => {
        return (
            title.toLowerCase().indexOf(term) >= 0 ||
            body.toLowerCase().indexOf(term) >= 0 ||
            String(id).toLowerCase().indexOf(term) >= 0
        )
    })
    return filteredPosts;
}

function renderFilteredPosts(event) {
    const filteredPosts = searchPosts(event.target.value, dataFromBack);
    postContainer.innerHTML = renderAllItems(filteredPosts, renderItem);
}
renderPosts();

filter.addEventListener("input", renderFilteredPosts);