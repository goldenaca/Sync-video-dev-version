const NUMBER_OF_ITEMS = 8;
const { REACT_APP_YOUTUBE_API_KEY } = process.env;
const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3";

export const getSearchItems = async (query) => {
  const searchUrl = new URL(`${YOUTUBE_API_URL}/search`);
  searchUrl.searchParams.append("part", "snippet");
  searchUrl.searchParams.append("key", REACT_APP_YOUTUBE_API_KEY);
  searchUrl.searchParams.append("type", "video");
  searchUrl.searchParams.append("maxResults", NUMBER_OF_ITEMS);
  searchUrl.searchParams.append("q", query);

  const res = await fetch(searchUrl.href);
  const data = await res.json();
  return data.items;
};
