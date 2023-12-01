import { getAllPlayers } from "src/network/services/player.service";
import { useEffect } from "react";
import { useQuery } from "react-query";

const Players = () => {

  const { data } = useQuery(['players'], () => getAllPlayers());

  useEffect(() => {
    console.log(data);
  }, [data]);

  

  return (
    <>
      Players
    </>
  );
};

export { Players };