import PlanetsList from "@/components/PlanetsList";
import { PlanetsAPI } from "@/types";
import { useState } from "react";

type HomeProps = {
  data: Array<{
    name: string;
    id: string;
  }>;
};

export const getServerSideProps = async () => {
  const props: Array<{
    name: string;
    id: string;
  }> = [];
  try {
    const res = await fetch("https://swapi.dev/api/planets");
    const data: PlanetsAPI = await res.json();
    props.push(
      ...data.results.map((planet) => {
        const name = planet.name;
        // get id from url
        const id = planet.url.split("/").slice(-2)[0];
        return { name, id };
      })
    );
  } catch (error) {
    console.log(error);
  }
  return {
    props: {
      data: props,
    },
  };
};

export default function Home(props: HomeProps) {
  const [page, setPage] = useState(1);
  const [planets, setPlanets] = useState(props.data.slice(0, 10));

  const Next = async () => {
    const res = await fetch(`https://swapi.dev/api/planets/?page=${page + 1}`);
    const data: PlanetsAPI = await res.json();
    setPlanets(data.results.map((planet) => {
      const name = planet.name;
      // get id from url
      const id = planet.url.split("/").slice(-2)[0];
      return { name, id };
    }));
    setPage(page + 1);
  };

  const Prev = async () => {
    const res = await fetch(`https://swapi.dev/api/planets/?page=${page - 1}`);
    const data: PlanetsAPI = await res.json();
    setPlanets(data.results.map((planet) => {
      const name = planet.name;
      // get id from url
      const id = planet.url.split("/").slice(-2)[0];
      return { name, id };
    }));
    setPage(page - 1);
  };

  return (
    <>
      <PlanetsList data={planets} />
      <div>
        {page > 1 && <button onClick={Prev}>Prev</button>}
        {planets.length === 10 && <button onClick={Next}>Next</button>}
      </div>
    </>
  );
}


