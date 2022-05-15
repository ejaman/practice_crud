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
  // memosStore.createIndex("title", ["title"], { unique: false });
  // memosStore.createIndex("content", ["content"], { unique: false });
  // first data
  memosStore.put({
    title: "how to use indexedDB",
    content: "idk",
  });
};

onRequest.onsuccess = async () => {
  console.log("success");
  await check();
  // addEntryToDb();
};

const addMemos = () => {
  const database = onRequest.result;
  const transaction = database.transaction("memos", "readwrite");
  const memos = transaction.objectStore("memos");
  const memo = {
    title: "lets find out",
    content: "ok!",
  };
  memos.add(memo);
};
// 사용자가 입력한 데이터를 데이터 베이스에 추가
const addEntryToDb = () => {
  const database = onRequest.result;
  const transaction = database.transaction("memos", "readwrite");
  const memos = transaction.objectStore("memos");
  const entry = {
    title: "add entry to db",
    content: "ok!",
  };
  memos.add(entry);
};

// 데이터베이스에 저장된 데이터를 화면에 렌더링
const getEntryFromDb = (id) => {
  const data = new Promise((resolve, reject) => {
    const database = onRequest.result;
    const transaction = database.transaction("memos", "readwrite");
    const memos = transaction.objectStore("memos");
    const request = id ? memos.get(id) : memos.getAll();
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
const check = async () => {
  const checkInfo = await getEntryFromDb();
  const info = `<div>${checkInfo[0] ? checkInfo[0].title : "title?"}</div>`;
  article.innerHTML = info;
};

const clearAllEntries = () => {
  const database = onRequest.result;
  const transaction = database.transaction("memos", "readwrite");
  const memos = transaction.objectStore("memos");
  memos.clear();
};

const article = document.querySelector(".article");
const note = document.querySelector(".note");
