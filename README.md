# Practice_CRUD
: 다양한 버전으로 crud를 만들며 crud는 물론 js, ts, indexeddb 등을 학습함

<br />

## 목차
1. [CRUD - VanillaJS](1.-crud_vanillaJS)
2. [CRUD - use Async and Indexeddb](2.-crud_asyncVersion-&-3.-crud_indexeddb)
3. [CRUD - TypeScript](4.-crud_typescript)
4. [CRUD - express & node.js](https://github.com/ejaman/express-crud)

crud 학습과 복습을 위해 만든 페이지이기 떄문에 html과 css는 모두 같은 파일을 사용

<br />


## 1. crud_vanillaJS
: crud에 대한 이해와 javascript에 대한 이해력을 향상 시키기 위해 가장 처음 만든 crud

🔗 https://ejaman.github.io/practice_crud/crud_vanillaJS/

<br />

### 문제점
별도의 다른 데이터 베이스 없이 json-server를 이용해서 만들었기 때문에 링크를 클릭해도 내 컴퓨터에서 데이터 베이스를 켜지 않으면 작동되지 않는다.

### 해결 방안
1. my json server를 사용하는 방법
- 구글에 검색했을 때 가장 먼저 나온 방법!
- 그러나 이 경우 Changes are faked and aren't persisted (just like JSONPlaceholder) 즉, 변화가 반영되지 않기 때문에 실질적으론 read 기능만 가능
2. firebase를 사용
- 기존에 리액트를 공부할 때 사용해 본적 있어서 비교적 간단할 것이라고 생각했음
- 

<br /><br />

## 2. crud_asyncVersion & 3.crud_indexeddb 
async와 await의 개념을 이해햐기 위해 만들어 본 버전
🔗 

<br />

## 1번과 2번의 다른 점?
:

<br />

### 문제점
역시나 이번에도 별도의 데이터 베이스가 없기 때문에 실질적으로 crud 기능이 수행되지 않는다

### 해결 방안
- indexeddb를 사용

<br />

### 앞으로 고칠 점
1. 모듈화

<br /><br />

## 4. crud_typescript : typescript를 사용해 만든 crud
