// 데이터베이스 열기
let onRequest = indexedDB.open("myDB", 1);
onRequest.onsuccess = () => {
  console.log("success");
};
onRequest.onupgradeneeded = () => {
  const database = onRequest.result;
  // 객체저장소 ObjectStore 생성
  // memosStore 저장소에 memos 테이블 생성( 오브젝트 스토어 생성 )
  const memosStore = database.createObjectStore("memos", {
    autoIncrement: true,
  });
  // first data
  memosStore.put({ title: "how to use indexedDB", content: "idk" });
  memosStore.put({ title: "lets find out", content: "ok!" });
  addMemos(); // ?
};

// Name이 일치하지만 존재하는 db가 없거나 호출에 실패했을 때
onRequest.onerror = () => {
  console.log("error");
};

// 데이터 추가하기
const addMemos = () => {
  const memo = {
    title: "check",
    content: "wow",
  };
  // transaction 시작하기 - 이미 존재하는 오브젝트 스토어의 데이터를 읽고 다시 쓸 것이기 때문에 readwrite 모드 사용
  const transaction = database.transaction("memos", "readwrite");
  const memos = transaction.objectStore("memos");
  memos.add(memo);
};

// 사용자 데이터 읽기
