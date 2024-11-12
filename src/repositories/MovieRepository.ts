import { injectable, inject } from "inversify";
import { Low } from "lowdb";
import { Movie } from "@/entities/Movie";
import IMovieRepository from "@/contracts/IMovieRepository";
import TYPES from "@/config/types";

@injectable()
export class MovieRepository implements IMovieRepository {
  private repository: Low<{ movies: Movie[] }>;

  constructor(@inject(TYPES.Lowdb) repository: Low<{ movies: Movie[] }>) {
    this.repository = repository;
  }

  async findProducerWithMaxAwardIntervals(): Promise<Movie | null> {
    await this.repository.read();
    // Implement logic to find producer with max award intervals
    return null;
  }

  async findProducerWithMinAwardIntervals(): Promise<Movie | null> {
    await this.repository.read();
    // Implement logic to find producer with min award intervals
    return null;
  }

  async save(movie: Movie): Promise<Movie> {
    await this.repository.read();
    this.repository.data?.movies.push(movie);
    await this.repository.write();
    return movie;
  }
}
