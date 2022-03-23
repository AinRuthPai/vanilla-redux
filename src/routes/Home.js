import { useState } from "react";
import { connect } from "react-redux";

function Home({ toDos }) {
  const [text, setText] = useState("");

  function onChange(event) {
    setText(event.target.value);
  }

  function onSubmit(event) {
    event.preventDefault();
    setText("");
  }

  return (
    <>
      <h1>To Do</h1>
      <form onSubmit={onSubmit}>
        <input type='text' value={text} onChange={onChange} />
        <button>Add</button>
      </form>
      <ul>{JSON.stringify(toDos)}</ul>
    </>
  );
}

// mapStateToProps / 첫번째 인자 => redux store에서 온 state
//                   두번째 인자 => component의 props
function mapStateToProps(state) {
  //  Home component로 props를 보낸다
  return { toDos: state };
}
// connect()는 return한 것을 component의 prop에 추가해준다
export default connect(mapStateToProps)(Home);

// mapStateToProps는 hooks에서 useSelector, redux에서는 getState
// mapDispatchToProps는 hooks에서 useDispatch, redux에서는 dispatch
