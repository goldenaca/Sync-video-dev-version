import React, { useState, useEffect } from "react";
import "./RoomChat.css";

function RoomChat({ roomId, socket, pepe }) {
  const [userName, setUserName] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [name, setName] = useState("");
  const [nameButton, setNameButton] = useState(true);

  // Send Messages
  const sendMessageHandler = (e) => {
    e.preventDefault();
    setChatLog([
      ...chatLog,
      { message: newMessage, name: userName, textColor: "rgb(180, 80, 80)" },
    ]);
    socket.emit("chatHandler", { newMessage, userName, roomId });
    setNewMessage("");
  };

  const changeNameHandler = (e) => {
    e.preventDefault();

    if (!name) return setNameButton(true);
    if (name.length > 22) return;
    localStorage.removeItem("userName");
    localStorage.setItem("userName", name);
    setUserName(name);
    setName("");
    setNameButton(true);
  };

  // hear incoming Messages
  useEffect(() => {
    if (!socket || !roomId) return;
    socket.on("chatHandler", ({ newMessage, userName }) => {
      setChatLog([
        ...chatLog,
        { message: newMessage, name: userName, textColor: "rgb(80, 80, 180)" },
      ]);
    });
    return () => socket.off("chatHandler");
  }, [socket, roomId, chatLog]);

  useEffect(() => {
    if (!localStorage.getItem("userName")) return setUserName("New Astronaut");
    setUserName(localStorage.getItem("userName"));
  }, []);

  return (
    <div className="room-chat-container">
      <form onSubmit={changeNameHandler}>
        {nameButton ? (
          <button className="name-btn" onClick={() => setNameButton(false)}>
            Change name
          </button>
        ) : (
          <input
            className="input"
            type="text"
            placeholder="Change name.. (max 20 characters)"
            onChange={(e) => setName(e.target.value)}
            value={name}
          ></input>
        )}
      </form>
      <div className="chat-container">
        <ul className="chat-messages-container">
          {chatLog.map((data) => (
            <li className="message-li">
              <p className="chat-name" style={{ color: data.textColor }}>
                {data.name}
              </p>
              <div className="message-text">{data.message}</div>
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={sendMessageHandler}>
        <input
          type="text"
          className="input"
          placeholder="Send message.."
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
        ></input>
      </form>
    </div>
  );
}
export default RoomChat;
