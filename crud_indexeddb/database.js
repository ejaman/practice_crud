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
    autoIncrement: true,
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
  console.log(checkEntries);

  document.querySelector("nav>ol").innerHTML = entries;
};
const navHandler = (event) => {
  event.preventDefault();
  console.log(event.target);
  let selectedId = 1 * event.target.id;
  console.log("nav", selectedId);
  read(selectedId);
};

// 데이터베이스에 저장된 데이터를 화면에 렌더링
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
  control(id, title);
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

const control = (selectedId, title) => {
  let contextUI = "";
  console.log(selectedId, title);
  if (selectedId !== null) {
    contextUI = `
        <li><a href="/update" onclick="event.preventDefault(); update(${selectedId});" >📝</a></li>
        <li><a href="/delete" onclick="event.preventDefault(); del(${title});" >🗑 </a></li> 
    `;
  }
  crud.innerHTML = `${contextUI}`;
};

// update
const update = () => {};
// delelte
const del = async (title) => {
  console.log("title", title);
  const database = onRequest.result;
  const transaction = database.transaction("memos", "readwrite");
  const memos = transaction.objectStore("memos");
  memos.delete(memos);
  nav();
};
