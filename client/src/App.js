import "./App.css";
import React, { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import YoutubeVideo from "./components/YoutubeVideo";
import NavBar from "./components/NavBar";
import { io } from "socket.io-client";
import RoomChat from "./components/RoomChat";

function App() {
  const [videoId, setVideoId] = useState("uD4izuDMUQA");
  const [roomId, setRoomId] = useState(null);
  const [joinSync, setJoinSync] = useState(false);
  const [mySocket, setMySocket] = useState(null);

  useEffect(() => {
    const socket = io.connect("http://localhost:3000/", {
      transports: ["websocket"],
    });
    setMySocket(socket);
  }, []);

  return (
    <div className="app-container">
      <SearchBar setVideoId={setVideoId} />
      <main className="main-container">
        <NavBar
          roomId={roomId}
          setRoomId={setRoomId}
          setJoinSync={setJoinSync}
        />

        <div className="deep-main-container">
          <YoutubeVideo
            setVideoId={setVideoId}
            videoId={videoId}
            socket={mySocket}
            roomId={roomId}
            joinSync={joinSync}
          />
          {mySocket ? <RoomChat socket={mySocket} roomId={roomId} /> : null}
        </div>
      </main>
    </div>
  );
}

export default App;
