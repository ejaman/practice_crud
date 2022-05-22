const article = document.querySelector(".article");
const note = document.querySelector(".note");
const crud = document.getElementById("control");

// 데이터베이스 열기
let onRequest = indexedDB.open("memoDB", 1);

// Name이 일치하지만 존재하는 db가 없거나 호출에 실패했을 때
onRequest.onerror = (event) => {
  console.log(`error: ${event}`);
};

// 새로운 데이터베이스를 만들었을 때 또는 기존 데이터 베이스에 업데이트가 필요할 때(version number is changed)
onRequest.onupgradeneeded = () => {
  const database = onRequest.result;
  // 객체저장소 ObjectStore 생성 (= collection, table)
  // memosStore 저장소에 memos 테이블 생성( 오브젝트 스토어 생성 )
  const memosStore = database.createObjectStore("memos", {
    keyPath: "id", // id를 객체의 식별자로 사용하겠다
    autoIncrement: true, // 오브젝트 스토어에 객체가 추가될 때 마다 아이디값이 자동으로 1씩 증가
  });
  // first data
  memosStore.put({
    title: "how to use indexedDB",
    content: `check my github page!<br/ > <a href="https://github.com/ejaman/practice_crud">Click me 👋</a>`,
  });
};

onRequest.onsuccess = async () => {
  console.log("success");

  await nav();
};
const welcome = () => {
  article.innerHTML = `
  <h1>Welcome</h1>
  <h3>lets make some quick memooo!!! 😎</h3>
  `;
  selectedId = null;
  article.style.border = "none";
  control(selectedId);
};

const getIndex = async () => {
  const data = new Promise((resolve, reject) => {
    const database = onRequest.result;
    const transaction = database.transaction("memos", "readwrite");
    const memos = transaction.objectStore("memos");
    const request = memos.getAll();
    request.onerror = () => {
      reject(request.error);
      console.log("error getting data from the store");
    };
    request.onsuccess = () => {
      resolve(request.result);
    };
  });
  return Promise.resolve(data);
};
const readHandler = async (id) => {
  const data = new Promise((resolve, reject) => {
    const database = onRequest.result;
    const transaction = database.transaction("memos", "readonly"); // 성능 향상을 위해
    const memos = transaction.objectStore("memos");
    const request = memos.get(id);
    request.onerror = () => {
      reject(request.error);
      console.log("error getting data from the store");
    };
    request.onsuccess = () => {
      resolve(request.result);
    };
  });
  return Promise.resolve(data);
};

const read = async (id) => {
  const data = await readHandler(id);
  const title = data.title;
  const content = data.content;
  const memo = `<h2>${title}</h2><p>${content}</p>`;
  article.innerHTML = memo;
  article.style.border = "1px solid";
  article.style.borderRadius = "10px";
  control(id);
};

const nav = async () => {
  const checkEntries = await getIndex();
  const entries = checkEntries
    .map(
      (entry) => `
  <li>
    <a href="/memos/${entry.id}" id="${entry.id}" onclick="event.preventDefault(); navHandler(${entry.id});">
        ${entry.title}
    </a>
  </li>`
    )
    .join("");

  document.querySelector("nav>ol").innerHTML = entries;
};
const navHandler = (id) => {
  let selectedId = id;
  read(selectedId);
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
const createHandler = async (event) => {
  event.preventDefault();
  const database = onRequest.result;
  const transaction = database.transaction("memos", "readwrite");
  const memos = transaction.objectStore("memos");
  const t = event.target.title.value;
  const c = event.target.content.value;
  const memo = {
    title: t,
    content: c,
  };
  memos.add(memo);
  nav();
  const next_id = await getIndex();
  await read(next_id.length);
};

const control = (id) => {
  let contextUI = "";
  if (id !== null) {
    contextUI = `
        <li><a href="/update" onclick="event.preventDefault(); update(${id});" >📝</a></li>
        <li><a href="/delete" onclick="event.preventDefault(); del(${id});" >🗑 </a></li> 
    `;
  }
  crud.innerHTML = `${contextUI}`;
};

// update
const update = async (id) => {
  const data = await readHandler(id);
  const title = data.title;
  const content = data.content;
  article.innerHTML = `
  <form onsubmit="updateHandler(event,${id})">
      <p><input id="title" type="text" name="title" placeholder="title" value="${title}"></p>
      <p><textarea id="content" onkeydown="(this)" onkeyup="resize(this)" name="content" placeholder="content">${content}</textarea></p>
      <p><input class="submitBtn" onclick="" type="submit" value="☑️"></p>
  </form>
`;
  control(id);
};
function resize(obj) {
  obj.style.height = "1px";
  obj.style.height = 12 + obj.scrollHeight + "px";
}

const updateHandler = async (event, id) => {
  event.preventDefault();
  const database = onRequest.result;
  const transaction = database.transaction("memos", "readwrite");
  const memos = transaction.objectStore("memos");
  const t = event.target.title.value;
  const c = event.target.content.value;
  const memo = { id: id, title: t, content: c };
  memos.put(memo);
  read(id);
  nav();
};

// delelte
const del = async (id) => {
  const database = onRequest.result;
  const transaction = database.transaction("memos", "readwrite");
  const memos = transaction.objectStore("memos");
  memos.delete(id);
  welcome();
  nav();
};

// delete all - not used
const resetNote = () => {
  const database = onRequest.result;
  const transaction = database.transaction("memos", "readwrite");
  const memos = transaction.objectStore("memos");
  memos.clear();
  nav();
  welcome();
};
