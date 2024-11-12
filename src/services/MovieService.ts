import { injectable, inject } from "inversify";
import { Movie } from "@/entities/Movie";
import IMovieRepository from "@/contracts/IMovieRepository";
import IMovieService from "@/contracts/IMovieService";
import TYPES from "@/config/types";

@injectable()
export class MovieService implements IMovieService {
  private movieRepository: IMovieRepository;

  constructor(
    @inject(TYPES.IMovieRepository) movieRepository: IMovieRepository
  ) {
    this.movieRepository = movieRepository;
  }

  async getProducersWithMaxAndMinAwardIntervals(): Promise<{
    max: Movie | null;
    min: Movie | null;
  }> {
    const producersWithMaxAwardIntervals =
      await this.movieRepository.findProducerWithMaxAwardIntervals();
    const producersWithMinAwardIntervals =
      await this.movieRepository.findProducerWithMinAwardIntervals();

    return {
      max: producersWithMaxAwardIntervals,
      min: producersWithMinAwardIntervals,
    };
  }

  async createMovie(movie: Movie): Promise<Movie> {
    return await this.movieRepository.save(movie);
  }
}
