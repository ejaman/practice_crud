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

const nav = () => {
  document.querySelector("nav>ol").innerHTML = "loading....";
  fetch("https://ejaman.github.io/practice_crud/crud_review/db.json")
    .then((res) => res.json())
    .then((memo) => {
      const tag = memo
        .map(
          (memo) => `
    <li>
        <a href="/read/${memo.id}" id="${memo.id}" onclick="navHandler(event);">
            ${memo.title}
        </a>
    </li>`
        )
        .join("");
      document.querySelector("nav>ol").innerHTML = tag;
    });
};

const read = (selectedId) => {
  console.log("read", selectedId);
  fetch(
    "https://ejaman.github.io/practice_crud/crud_review/db.json" + selectedId
  )
    .then((res) => res.json())
    .then((memo) => {
      const content = `<h2>${memo.title}</h2><p>${memo.content}</p>`;
      article.innerHTML = content;
      control(selectedId);
    });
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

const createHandler = (event) => {
  event.preventDefault();
  const t = event.target.title.value;
  const c = event.target.content.value;
  fetch("https://ejaman.github.io/practice_crud/crud_review/db.json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: t, content: c }),
  })
    .then((res) => res.json())
    .then((data) => {
      selectedId = data.id;
      let nextId = selectedId + 1;
      const newMemo = { id: nextId, title: t, content: c };
      nav();
      read(selectedId);
    });
};

const create = () => {
  crud.innerHTML = " ";
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

function updateHandler(event, selectedId) {
  event.preventDefault();
  console.log(event.target);
  const t = event.target.title.value;
  const c = event.target.content.value;
  fetch(
    "https://ejaman.github.io/practice_crud/crud_review/db.json" + selectedId,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: t, content: c }),
    }
  )
    .then((res) => res.json())
    .then((data) => {
      nav();
      selectedId = data.id;
      console.log("data", data);
      read(selectedId);
    });
}

const update = (selectedId) => {
  console.log("update", selectedId);
  fetch(
    "https://ejaman.github.io/practice_crud/crud_review/db.json" + selectedId
  )
    .then((res) => res.json())
    .then((memo) => {
      article.innerHTML = `
    <form onsubmit="updateHandler(event,${selectedId})">
        <p><input id="title" type="text" name="title" placeholder="title" value="${memo.title}"></p>
        <p><textarea id="content" onkeydown="resize(this)" onkeyup="resize(this)" name="content" placeholder="content">${memo.content}</textarea></p>
        <p><input class="submitBtn" onclick="" type="submit" value="☑️"></p>
    </form>
  `;
      control(selectedId);
    });
};

function resize(obj) {
  obj.style.height = "1px";
  obj.style.height = 12 + obj.scrollHeight + "px";
}

const del = (selectedId) => {
  fetch(
    "https://ejaman.github.io/practice_crud/crud_review/db.json" + selectedId,
    {
      method: "DELETE",
    }
  )
    .then((res) => res.json())
    .then((data) => {
      nav();
      selectedId = null;
      welcome();
    });
};
nav();
