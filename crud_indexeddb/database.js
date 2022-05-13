// 데이터베이스 열기
let onRequest = indexedDB.open("myDB", 1);
onRequest.onsuccess = () => {
  console.log("success");
};
onRequest.onupgradeneeded = () => {
  const database = onRequest.result;
  // 객체저장소 ObjectStore 생성
  // memosStore 저장소에 memos 테이블 생성
  const memosStore = database.createObjectStore("memos", {
    autoIncrement: true,
  });
  // first data
  memosStore.put({ title: "how to use indexedDB", content: "idk" });
  memosStore.put({ title: "lets find out", content: "ok!" });
};

// Name이 일치하지만 존재하는 db가 없거나 호출에 실패했을 때
onRequest.onerror = () => {
  console.log("error");
};

// transaction 데이터를 넣고 뺴기
// 사용자가 입력한 데이터를 데이터베이스에 추가
const addEntryToDB = (storeName, entry) => {
  const database = onRequest.result;
  const transaction = database.transaction([storeName], "readwrite");
  // store에 값을 삽입하기 위해 objectStore()함수로 테이블 선택, add()함수로 객체 추가
  const store = transaction.objectStore(storeName);
  store.add(entry);

  // transaction.oncmplete = () => alert("entry added")
  transaction.onerror = () => {
    console.log(`error: can't adding Entry to ${storeName}`);
    console.log(transaction.error);
  };
};

// 데이터베이스에 저장된 데이터를 화면에 랜더링
const getEntryFromDB = (storeName, id) => {
  const data = new Promise((resolve, reject) => {
    const database = onRequest.result;
    const transaction = database.transaction([storeName]);
    const store = transaction.objectStore(storeName);
    // id가 유효하다면 store.get()을 사용, request에 가져온 데이터를 할당, 유효하지 않을 시 store.getAll()
    const request = id ? store.get[id] : store.getAll(id);

    request.onerror = () => {
      reject(request.error);
      console.log(`error: can't get data from the store`);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };
  });
  return Promise.resolve(data);
};

const clearAllEntries = (storeName) => {
  const database = onRequest.result;
  const transaction = database.transaction([storeName], "readwrite");
  const store = transaction.objectStore(storeName);
  store.clear();
};

// export { onRequest, addEntryToDB, getEntryFromDB, clearAllEntries };
