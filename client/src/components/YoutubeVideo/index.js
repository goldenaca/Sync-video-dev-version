import React, { useEffect, useRef, useState } from "react";
import { addListener, removeListener } from "./utils";
import "./youtubeVideo.css";
let lastId = 0;
let loaded = false;

function YoutubeVideo({ videoId, socket, roomId, joinSync, setVideoId }) {
  const currentId = useRef(lastId).current;
  const player = useRef(null);
  const [playerLoaded, setPlayerIsLoaded] = useState(loaded);
  const playerId = `player-${currentId}`;
  const isLocalEvent = useRef({
    shouldMatch: null,
    localPlayer: true,
  });
  const isLocalVideoLoad = useRef(true);
  const currentVideoId = useRef(videoId);

  // setLocalEvent Handler

  function setLocalEvent(event) {
    switch (event) {
      case "play":
        isLocalEvent.current = {
          localPlayer: false,
          shouldMatch: 1,
        };
        break;
      case "stop":
        isLocalEvent.current = {
          localPlayer: false,
          shouldMatch: 2,
        };
        break;
      case "loadVideo":
        isLocalVideoLoad.current = false;
        break;
      default:
        break;
    }
  }

  // YoutubeVideo ID Handler
  useEffect(() => (lastId += 1), []);

  // Youtube API Call when finished loading listener
  useEffect(() => {
    const listener = (l) => {
      setPlayerIsLoaded(l);
      loaded = l;
    };
    addListener(listener);
    return () => removeListener(listener);
  }, []);

  // Iframe Youtube API Load
  useEffect(() => {
    if (playerLoaded) return;
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.append(tag);
  }, [playerLoaded]);

  // Youtube player init
  useEffect(() => {
    if (!playerLoaded) return;
    player.current = new window.YT.Player(playerId, {
      setVideoId,
      height: 500,
      width: 889,
      videoId,
      playerVars: {
        playsinline: 1,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerLoaded, playerId]);

  // Player event listeneer
  useEffect(() => {
    if (!playerLoaded) return;
    function onPlayerStateChange(event) {
      if (!roomId || !socket) return;
      if (isLocalEvent.current.localPlayer) {
        switch (event.data) {
          case 1:
            console.log("E - play");
            socket.emit("serverEventsHandler", {
              type: "playerEvent",
              event: "PLAY",
              roomId: roomId,
              currentData: { time: player.current.playerInfo.currentTime },
            });
            break;
          case 2:
            console.log("E - stop");
            socket.emit("serverEventsHandler", {
              type: "playerEvent",
              event: "PAUSE",
              roomId: roomId,
            });
            break;
          default:
            break;
        }
      }
      if (isLocalEvent.current.shouldMatch === event.data) {
        isLocalEvent.current = {
          shouldMatch: null,
          localPlayer: true,
        };
      }
    }
    player.current.addEventListener("onStateChange", onPlayerStateChange);
    return () => {
      player.current.removeEventListener("onStateChange", onPlayerStateChange);
    };
  }, [playerLoaded, roomId, socket]);

  // Load new video Function
  useEffect(() => {
    if (!player.current || !videoId) return;
    setLocalEvent("play");
    player.current.loadVideoById(videoId);
    currentVideoId.current = videoId;
    if (roomId && isLocalVideoLoad.current) {
      socket.emit("serverEventsHandler", {
        type: "loadVideo",
        roomId: roomId,
        currentData: { newVideoId: videoId },
      });
    } else isLocalVideoLoad.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId, socket]);

  //Joining Rooms
  useEffect(() => {
    if (!socket || !roomId) return;
    socket.emit("roomHandler", { roomId, joinSync });
  }, [joinSync, roomId, socket]);

  //  SockerIO Listeneer
  useEffect(() => {
    if (!socket || !roomId) return;
    //Server Listeneer
    socket.on("serverEventsHandler", ({ type, event, currentData }) => {
      switch (type) {
        case "playerEvent":
          if (event === "PLAY") {
            setLocalEvent("play");
            player.current.seekTo(Math.round(currentData.time + 0.5), true);
            setTimeout(() => {
              player.current.playVideo();
            }, 250);
          } else if (event === "PAUSE") {
            setLocalEvent("stop");
            player.current.pauseVideo();
          }
          break;

        case "loadVideo":
          setLocalEvent("loadVideo");
          setVideoId(currentData.newVideoId);
          break;

        case "joinAskData":
          socket.emit("serverEventsHandler", {
            type: "sendJoinedData",
            currentData: {
              newVideoId: currentVideoId.current,
              newSocketId: currentData.newSocketId,
              time: player.current.playerInfo.currentTime,
              state: player.current.getPlayerState(),
            },
          });
          break;

        case "recieveCurrentData":
          //load video
          if (currentData.newVideoId !== videoId) {
            setLocalEvent("loadVideo");
            setVideoId(currentData.newVideoId);
          }
          //Put time and state on local player
          setTimeout(() => {
            if (currentData.state === 1 || currentData.state === 3) {
              setLocalEvent("play");
              player.current.seekTo(Math.round(currentData.time + 1), true);
            } else {
              setLocalEvent("play");
              player.current.seekTo(Math.round(currentData.time + 1), true);
              setTimeout(() => {
                setLocalEvent("stop");
                player.current.pauseVideo();
              }, 500);
            }
          }, 2000);
          break;
        default:
          break;
      }
    });

    return () => socket.off("roomHandler");
  }, [joinSync, roomId, setVideoId, socket, videoId]);

  return (
    <div className="video-container">
      <div className="video-display" id={playerId}></div>
    </div>
  );
}

export default YoutubeVideo;
