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
    content: "idk",
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

const nav = async () => {
  const checkEntries = await getEntryFromDb();
  const entries = checkEntries
    .map(
      (entry, idx) => `
  <li>
    <a href="/memos/${idx}" id="${idx}" onclick="navHandler(event);">
        ${entry.title}
    </a>
  </li>`
    )
    .join("");

  document.querySelector("nav>ol").innerHTML = entries;
};
const navHandler = (event) => {
  event.preventDefault();
  console.log("event target", event.target);
  let selectedId = 1 * event.target.id;

  console.log("nav", selectedId);
  readHandler(selectedId);
};

// 데이터베이스에 저장된 데이터를 화면에 렌더링
const readHandler = async (id) => {
  const database = onRequest.result;
  const transaction = database.transaction("memos", "readonly"); // 성능 향상을 위해
  const memos = transaction.objectStore("memos");
  console.log("id: ", memos.get(id));
};
const getEntryFromDb = () => {
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

const read = async (id) => {
  const checkEntries = await getEntryFromDb();
  const title = checkEntries[id].title;
  const content = checkEntries[id].content;
  console.log("read", title);
  const memo = `<h2>${title}</h2><p>${content}</p>`;
  article.innerHTML = memo;
  article.style.border = "1px solid";
  article.style.borderRadius = "10px";
  control(id);
};

// 사용자가 입력한 데이터를 데이터 베이스에 추가
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
  // read();
};

const control = (selectedId) => {
  let contextUI = "";
  console.log(selectedId);
  if (selectedId !== null) {
    contextUI = `
        <li><a href="/update" onclick="event.preventDefault(); update();" >📝</a></li>
        <li><a href="/delete" onclick="event.preventDefault(); resetNote();" >🗑 </a></li> 
    `;
  }
  console.log("check this", contextUI);
  crud.innerHTML = `${contextUI}`;
};

// update

// delelte
const del = async () => {
  const database = onRequest.result;
  const transaction = database.transaction("memos", "readwrite");
  const memos = transaction.objectStore("memos");
  memos.delete(memos);
  nav();
};

// delete all
const resetNote = () => {
  const database = onRequest.result;
  const transaction = database.transaction("memos", "readwrite");
  const memos = transaction.objectStore("memos");
  memos.clear();
  nav();
  welcome();
};
