import { useEffect, useState } from "react";

import PlanetComponent from "@/components/Planet";
import { Planet, PlanetAPI } from "@/types";

const PlanetPage = ({ id }: { id: string }) => {
  const [data, setData] = useState<Planet | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`https://swapi.dev/api/planets/${id}`);
      const dataAPI: PlanetAPI = await res.json();
      const planet: Planet = {
        ...dataAPI,
        residents: await Promise.all(
          dataAPI.residents.map(async (r: string) => {
            const data = await fetch(r);
            return await data.json();
          })
        ),
        films: await Promise.all(
          dataAPI.films.map(async (f: string) => {
            const data = await fetch(f);
            return await data.json();
          })
        ),
      };
      setData(planet);
    };
    fetchData();
  }, [id]);

  return data ? <PlanetComponent data={data} /> : <div>Loading...</div>;
};

export async function getServerSideProps({ query }: { query: { id: string } }) {
  return {
    props: {
      id: query.id,
    },
  };
}

export default PlanetPage;

    
