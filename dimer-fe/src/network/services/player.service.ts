import { client } from "src/network/httpClient";

const getAllPlayers = () => {
  return client.get('/user');
};

export { getAllPlayers };
