import { Movie } from "@/entities/Movie";

export default interface IMovieRepository {
  findProducerWithMaxAwardIntervals(): Promise<Movie | null>;
  findProducerWithMinAwardIntervals(): Promise<Movie | null>;
  save(movie: Movie): Promise<Movie>;
}
