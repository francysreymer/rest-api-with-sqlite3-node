import { Movie } from "@/entities/Movie";

export default interface IMovieService {
  getProducersWithMaxAndMinAwardIntervals(): Promise<{
    max: Movie | null;
    min: Movie | null;
  }>;
  createMovie(movie: Movie): Promise<Movie>;
}
