const article = document.querySelector(".article");
const note = document.querySelector(".note");
const crud = document.getElementById("control");

const welcome = () => {
  article.innerHTML = `
  <h1>Welcome</h1>
  <h3>lets make a quick memo 😎</h3>
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
  fetch("http://localhost:3000/memos")
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
  article.style.border = "1px solid";
  article.style.borderRadius = "10px";
  fetch("http://localhost:3000/memos/" + selectedId)
    .then((res) => res.json())
    .then((memo) => {
      const content = `<h2>${memo.title}</h2><p>${memo.content}</p>`;
      article.innerHTML = content;
      control(selectedId);
    });
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
  fetch("http://localhost:3000/memos/", {
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
  const content = `
  <form onsubmit="createHandler(event);">
      <p><input type="text" name="title" placeholder="title"></p>
      <p><textarea name="content" placeholder="content"></textarea></p>
      <p><input type="submit" value="➕"></p>
  </form>
`;
  note.innerHTML = content;
};

function updateHandler(event, selectedId) {
  event.preventDefault();
  console.log(event.target);
  const t = event.target.title.value;
  const c = event.target.content.value;
  fetch("http://localhost:3000/memos/" + selectedId, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: t, content: c }),
  })
    .then((res) => res.json())
    .then((data) => {
      nav();
      selectedId = data.id;
      console.log(data);
      read(selectedId);
    });
}

const update = (selectedId) => {
  console.log("update", selectedId);
  fetch("http://localhost:3000/memos/" + selectedId)
    .then((res) => res.json())
    .then((memo) => {
      article.innerHTML = `
    <h2>Update</h2>
    <form onsubmit="updateHandler(event,${selectedId})">
        <p><input type="text" name="title" placeholder="title" value="${memo.title}"></p>
        <p><textarea name="content" placeholder="content">${memo.content}</textarea></p>
        <p><input type="submit" value="update"></p>
    </form>
  `;
      control(selectedId);
    });
};

const del = (selectedId) => {
  fetch("http://localhost:3000/memos/" + selectedId, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((data) => {
      nav();
      selectedId = null;
      welcome();
      control();
    });
};
nav();
