import { Low, Memory } from "lowdb";
import { Movie } from "@/entities/Movie";

type Data = {
  movies: Movie[];
};

const adapter = new Memory<Data>();
const defaultData: Data = { movies: [] };
const db = new Low(adapter, defaultData);

export default db;
