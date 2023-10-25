import { client } from "src/network/httpClient";

const getAllPlayers = () => {
  return client.get('/posts');
};

export { getAllPlayers };