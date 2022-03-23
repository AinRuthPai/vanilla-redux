# Vanilla Redux

- install

  redux
  react-redux
  react-router-dom

## 코드 분석

### add 버튼을 누르면 +1, minus 버튼을 누르면 -1이 되는 프로그램

```javascript
const add = document.querySelector("#add");
const minus = document.querySelector("#minus");
const number = document.querySelector("span");

number.innerText = 0;

// reducer
// 현재 상태(count = 0)의 어플리케이션 / action과 함께 불려지는 함수
// countModifier가 return하는 것은 어플리케이션의 state가 됨
const countModifier = (count = 0, action) => {
  if (action.type === "ADD") {
    return count + 1;
  } else if (action.type === "MINUS") {
    return count - 1;
  } else {
    return count;
  }
};

const countStore = createStore(countModifier);

// 현재 상태를 number.innerText 에 넣어주는 코드이다
const onChange = () => {
  number.innerText = countStore.getState();
};

// 변화를 store에서 감지하고 싶다면 subscribe를 사용한다
// 변화를 감지하고, onChange 함수를 실행하는 문장이다
countStore.subscribe(onChange);

add.addEventListener("click", () => {
  // reducer에게 dispatch를 이용하여 action을 보낸다
  // dispatch가 reducer를 불러서 current state와 action을 더한다
  // action은 무조건 object여야 한다 && type이 존재하여야 한다
  countStore.dispatch({ type: "ADD" });
});

minus.addEventListener("click", () => {
  countStore.dispatch({ type: "MINUS" });
});
```

- 수정된 코드

```javascript
// string이 아닌 변수로 지정하게 되면, 오타가 있더라도 오류를 찾기 편해진다
const ADD = "ADD";
const MINUS = "MINUS";

const countModifier = (count = 0, action) => {
  // if 문 보다는 switch 문이 가독성이 좋고 깔끔하다
  switch (action.type) {
    case ADD:
      return count + 1;
    case MINUS:
      return count - 1;
    default:
      return count;
  }
};
```

### To Do List 프로그램

- no-redux

```javascript
const input = document.querySelector("input");
const form = document.querySelector("form");
const ul = document.querySelector("ul");

function createToDo(toDo) {
  const li = document.createElement("li");
  li.innerText = toDo;
  ul.appendChild(li);
}

function onSubmit(event) {
  event.preventDefault();
  const toDo = input.value;
  input.value = "";
  createToDo(toDo);
}

form.addEventListener("submit", onSubmit);
```

- redux를 이용한 코드

```javascript
import { createStore } from "redux";

const input = document.querySelector("input");
const form = document.querySelector("form");
const ul = document.querySelector("ul");

const ADD_TODO = "ADD_TODO";
const DELETE_TODO = "DELETE_TODO";

// action creator => 단순히 object만 return한다
const addToDo = (text) => {
  return {
    type: ADD_TODO,
    text,
  };
};

const deleteToDo = (id) => {
  return {
    type: DELETE_TODO,
    id,
  };
};

const reducer = (state = [], action) => {
  switch (action.type) {
    case ADD_TODO:
      // return state.push(action.text) 는 절대 하지 않는다
      // mutating state를 하는 대신에 new state objects를 리턴해야 한다
      // mutation ex) friends = ["dal"];
      //              friends.push("lynn");
      // 이것이 friends를 mutate한 것이다 (절대 사용 X)
      // 해당 array는 과거의 state와 새로운 todo를 갖고 있게 된다
      const newToDoObj = { text: action.text, id: Date.now() };
      return [newToDoObj, ...state];
    case DELETE_TODO:
      // filter는 새로운 array를 생성하므로 mutate하지 않는다
      const cleaned = state.filter((toDo) => toDo.id !== action.id);
      return cleaned;
    default:
      return state;
  }
};

const store = createStore(reducer);

store.subscribe(() => console.log(store.getState()));

// action 을 dispatch하기 위해 만든 함수
// action creator는 reducer 위에 선언
const dispatchAddToDo = (text) => {
  store.dispatch(addToDo(text));
};

const dispatchDeleteToDo = (event) => {
  const id = parseInt(event.target.parentNode.id);
  store.dispatch(deleteToDo(id));
};

const paintToDos = () => {
  const toDos = store.getState();
  // clean list
  ul.innerHTML = "";
  toDos.forEach((toDo) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.innerText = "DEL";
    btn.addEventListener("click", dispatchDeleteToDo);
    li.id = toDo.id;
    li.innerText = toDo.text;
    li.appendChild(btn);
    ul.appendChild(li);
  });
};

// toDo의 변화에 맞게 list를 repainting한다
store.subscribe(paintToDos);

function onSubmit(event) {
  event.preventDefault();
  const toDo = input.value;
  input.value = "";
  dispatchAddToDo(toDo);
}

form.addEventListener("submit", onSubmit);
```
