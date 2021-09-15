import React from "react";
import "./NavBar.css";

function NavBar({ roomId, setRoomId, setJoinSync }) {
  const [joinRoomId, setJoinRoomId] = React.useState("");

  const createRoomHandler = (e) => {
    let createdRoomId = Math.floor(1000 + Math.random() * 9000).toString();
    setRoomId(createdRoomId);
  };

  const joinRoomHandler = (e) => {
    e.preventDefault();
    if (joinRoomId.length !== 4) return;
    setJoinSync(true);
    setRoomId(joinRoomId);
    setJoinRoomId("");
  };

  const leaveRoomHandler = () => {
    window.location.reload();
  };

  return (
    <div className="nav-container">
      {roomId ? (
        <div className="room-info-container">
          <p className="room-info"> Your room ID: {roomId}</p>
          <button onClick={leaveRoomHandler} className="create-room-button">
            LEAVE ROOM
          </button>
        </div>
      ) : (
        <div className="room-info-container">
          <button className="create-room-button" onClick={createRoomHandler}>
            CREATE ROOM
          </button>
          <form className="join-container" onSubmit={joinRoomHandler}>
            <input
              className="join-room-input"
              placeholder=" Enter room ID"
              value={joinRoomId}
              onChange={(e) => setJoinRoomId(e.target.value)}
            ></input>
            <button className="join-room-button">JOIN ROOM</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default NavBar;
