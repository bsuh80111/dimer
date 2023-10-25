import { client } from "src/network/httpClient";
import { useEffect } from "react";
import { useQuery } from "react-query";

const Home = () => {

  const { data } = useQuery(['posts'], () => client.get('/posts'));

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <>
      <h1>Dimer</h1>
      <small>Hi Luke</small>
    </>
  );
};

export { Home };
