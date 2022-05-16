const article = document.querySelector(".article");
const note = document.querySelector(".note");
const crud = document.getElementById("control");

const welcome = () => {
  article.innerHTML = `
  <h1>Welcome</h1>
  <h3>lets make some quick memooo!!! 😎</h3>
  `;
  selectedId = null;
  article.style.border = "none";
  control(selectedId);
};

const navHandler = (event) => {
  event.preventDefault();
  let selectedId = 1 * event.target.id;
  console.log("nav", selectedId);
  read(selectedId);
};

const nav = async () => {
  document.querySelector("nav>ol").innerHTML = "loading....";
  const res = await fetch("http://localhost:3000/memos");
  const memos = await res.json();
  const memo = memos
    .map(
      (memo) => `
<li>
  <a href="/read/${memo.id}" id="${memo.id}" onclick="navHandler(event);">
      ${memo.title}
  </a>
</li>`
    )
    .join("");
  document.querySelector("nav>ol").innerHTML = memo;
};

const read = async (selectedId) => {
  console.log("read", selectedId);
  const res = await fetch("http://localhost:3000/memos/" + selectedId);
  const memos = await res.json();
  const memo = `<h2>${memos.title}</h2><p>${memos.content}</p>`;
  article.innerHTML = memo;
  control(selectedId);
  article.style.border = "1px solid";
  article.style.borderRadius = "10px";
};

const control = (selectedId) => {
  let contextUI = "";
  console.log(selectedId);
  if (selectedId !== null) {
    contextUI = `
        <li><a href="/update" onclick="event.preventDefault(); update(${selectedId});" >📝</a></li>
        <li><a href="/delete" onclick="event.preventDefault(); del(${selectedId});" >🗑 </a></li> 
    `;
  }
  crud.innerHTML = `${contextUI}`;
};

const create = () => {
  crud.innerHTML = "";
  const content = `
  <form onsubmit="createHandler(event);">
      <p><input id="title" type="text" name="title" placeholder="title"></p>
      <p><textarea id="content" name="content" placeholder="content"></textarea></p>
      <p><input class="submitBtn" type="submit" value="➕"></p>
  </form>
`;
  article.innerHTML = content;
  article.style.border = "1px solid";
  article.style.borderRadius = "10px";
};

const updateHandler = async (event, selectedId) => {
  event.preventDefault();
  console.log(event.target);
  const t = event.target.title.value;
  const c = event.target.content.value;
  const res = await fetch("http://localhost:3000/memos/" + selectedId, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: t, content: c }),
  });
  const data = await res.json();
  nav();
  selectedId = data.id;
  console.log("data", data);
  read(selectedId);
};

const update = async (selectedId) => {
  console.log("update", selectedId);
  const res = await fetch("http://localhost:3000/memos/" + selectedId);
  const memo = await res.json();
  article.innerHTML = `
  <form onsubmit="updateHandler(event,${selectedId})">
      <p><input id="title" type="text" name="title" placeholder="title" value="${memo.title}"></p>
      <p><textarea id="content" onkeydown="(this)" onkeyup="resize(this)" name="content" placeholder="content">${memo.content}</textarea></p>
      <p><input class="submitBtn" onclick="" type="submit" value="☑️"></p>
  </form>
`;
  control(selectedId);
};

function resize(obj) {
  obj.style.height = "1px";
  obj.style.height = 12 + obj.scrollHeight + "px";
}

const del = async (selectedId) => {
  const res = await fetch("http://localhost:3000/memos/" + selectedId, {
    method: "DELETE",
  });
  const data = await res.json();
  nav();
  selectedId = null;
  welcome();
};
nav();
