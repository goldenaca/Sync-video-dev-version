import React, { useState } from "react";
import { getSearchItems } from "../../api/youtube";
import throttle from "../../utilites";
import "./searchBar.css";

function SearchBar({ setVideoId }) {
  const [searchResult, setSearchResult] = useState([]);
  const [searchBar, setSearchBar] = useState("");

  const onSearchBarChange = async (e) => {
    if (e.target.value.length === 0) return setSearchResult([]);
    // calls to api
    const items = await getSearchItems(e.target.value);
    //No searched videos
    //Normalize Result
    const normalizedMap = items.map((item) => {
      return {
        id: item.id.videoId,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        videoImage: item.snippet.thumbnails.high,
      };
    });
    // Putting Normalized data on state
    setSearchResult(normalizedMap);
  };

  const submitVideoHandler = (e) => {
    setVideoId(e.target.id);
    setSearchBar("");
  };
  return (
    <div className="search-bar-container">
      <input
        id="search-bar"
        className="search-bar"
        onChange={(event) => {
          throttle(onSearchBarChange, 500, event);
          setSearchBar(event.target.value);
        }}
        placeholder="Search video..."
        type="search"
        value={searchBar}
      />
      <ul>
        {searchBar
          ? searchResult.map((video) => (
              <li key={video.id} className="video">
                <img
                  src={video.videoImage.url}
                  alt=""
                  className="video-image"
                />
                <div className="video-info-container">
                  <h3>{video.title}</h3>
                  <p>{video.channelTitle}</p>
                </div>
                <buttom className="video-button">
                  <i
                    id={video.id}
                    onClick={submitVideoHandler}
                    class="fas fa-play"
                  ></i>
                </buttom>
              </li>
            ))
          : null}
      </ul>
    </div>
  );
}

export default SearchBar;
