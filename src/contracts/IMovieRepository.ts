import { Movie } from "@/entities/Movie";
import { WinnerProducer } from "@/types/WinnerProducer";

export default interface IMovieRepository {
  save(movie: Movie): Promise<Movie>;
  findById(id: number | bigint): Promise<Movie | null>;
  saveManyProducers(
    movieId: number | bigint,
    producersIds: (number | bigint)[]
  ): Promise<void>;
  saveManyStudios(
    movieId: number | bigint,
    studiosIds: (number | bigint)[]
  ): Promise<void>;
}
