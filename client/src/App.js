import { useEffect, useRef, useState } from "react";
import "./App.css";
import logo from "./images/SeeBookIcon.png";

// 1
const webSocket = new WebSocket("ws://localhost:5000");

function App() {
  // 2
  const messagesEndRef = useRef(null);
  const [userId, setUserId] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgList, setMsgList] = useState([]);

  // 3
  useEffect(() => {
    if (!webSocket) return;
    webSocket.onopen = function () {
      console.log("open", webSocket.protocol);
    };
    // 4
    webSocket.onmessage = function (e) {
      console.log("호출");
      const { data, id, type } = JSON.parse(e.data);
      setMsgList((prev) => [
        ...prev,
        {
          msg: type === "welcome" ? `${data} joins the chat` : data,
          type: type,
          id: id,
        },
      ]);
    };
    webSocket.onclose = function () {
      console.log("close");
    };
  }, []);
  // 5
  useEffect(() => {
    scrollToBottom();
  }, [msgList]);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    console.log(msgList);
  }, [msgList]);

  // 6
  const onSubmitHandler = (e) => {
    e.preventDefault();
    const sendData = {
      type: "id",
      data: userId,
    };
    webSocket.send(JSON.stringify(sendData));
    setIsLogin(true);
  };
  // 7
  const onChangeUserIdHandler = (e) => {
    setUserId(e.target.value);
  };
  // 8
  const onSendSubmitHandler = (e) => {
    e.preventDefault();
    const sendData = {
      type: "msg",
      data: msg,
      id: userId,
    };
    webSocket.send(JSON.stringify(sendData));
    setMsgList((prev) => [...prev, { msg: msg, type: "me", id: userId }]);
    setMsg("");
  };
  // 9
  const onChangeMsgHandler = (e) => {
    setMsg(e.target.value);
  };

  return (
    <div className="app-container">
      <div className="wrap">
        {isLogin ? (
          // 10
          <div className="chat-box">
            <h3>Login as a "{userId}"</h3>
            <ul className="chat">
              {msgList.map((v, i) =>
                v.type === "welcome" ? (
                  <li className="welcome">
                    <div className="line" />
                    <div>{v.msg}</div>
                    <div className="line" />
                  </li>
                ) : (
                  <li className={v.type} key={`${i}_li`}>
                    <div className="userId">{v.id}</div>
                    <div className={v.type}>{v.msg}</div>
                  </li>
                )
              )}
            </ul>
            <form className="send-form" onSubmit={onSendSubmitHandler}>
              <input
                placeholder="Enter your message"
                onChange={onChangeMsgHandler}
                value={msg}
              />
              <button type="submit">send</button>
            </form>
          </div>
        ) : (
          // 11
          <div className="login-box">
            <div className="login-title">
              <img src={logo} width="40px" height="40px" alt="logo" />
              <div>WebChat</div>
            </div>
            <form className="login-form" onSubmit={onSubmitHandler}>
              <input
                placeholder="Enter your ID"
                onChange={onChangeUserIdHandler}
                value={userId}
              />
              <button type="submit">Login</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
