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
  const [mySocket, setMySocket] = useState({ id: false });

  useEffect(() => {
    const socket = io.connect("https://sync-yt-video.herokuapp.com/", {
      transports: ["websocket"],
    });

    const loading = setInterval(() => {
      if (socket.id) {
        setMySocket(socket);
        clearInterval(loading);
      }
    }, 100);
  }, []);

  return (
    <div className="app-container">
      <SearchBar setVideoId={setVideoId} />
      {mySocket.id ? (
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
            <RoomChat socket={mySocket} roomId={roomId} />
          </div>
        </main>
      ) : (
        <p className="loading-screen"> LOADING </p>
      )}
    </div>
  );
}

export default App;
