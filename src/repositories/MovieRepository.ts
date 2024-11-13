import { injectable, inject } from "inversify";
import Database from "better-sqlite3";
import { Movie } from "@/entities/Movie";
import IMovieRepository from "@/contracts/IMovieRepository";
import TYPES from "@/config/types";

@injectable()
export default class MovieRepository implements IMovieRepository {
  private repository: Database.Database;

  constructor(@inject(TYPES.DB) repository: Database.Database) {
    this.repository = repository;
  }

  async save(movie: Movie): Promise<Movie> {
    const stmt = this.repository.prepare(`
      INSERT INTO movies (year, title, winner)
      VALUES (?, ?, ?)
    `);

    const info = stmt.run(movie.year, movie.title, movie.winner);
    const savedMovie = await this.findById(info.lastInsertRowid);

    if (!savedMovie) {
      throw new Error("Failed to save movie");
    }

    return savedMovie;
  }

  async findById(id: number | bigint): Promise<Movie | null> {
    const stmt = this.repository.prepare(`
      SELECT * FROM movies WHERE id = ?
    `);
    const movie = stmt.get(id) as Movie | undefined;
    return movie || null;
  }

  async saveManyProducers(
    movieId: number | bigint,
    producersIds: (number | bigint)[]
  ): Promise<boolean> {
    const insertStmt = this.repository.prepare(`
      INSERT INTO movie_producers (movie_id, producer_id)
      VALUES (?, ?)
    `);

    const insertMany = this.repository.transaction(
      (producersIds: (number | bigint)[]) => {
        for (const producerId of producersIds) {
          insertStmt.run(movieId, producerId);
        }
      }
    );

    try {
      insertMany(producersIds);
      return true;
    } catch (error) {
      return false;
    }
  }

  async saveManyStudios(
    movieId: number | bigint,
    studiosIds: (number | bigint)[]
  ): Promise<boolean> {
    const insertStmt = this.repository.prepare(`
      INSERT INTO movie_studios (movie_id, studio_id)
      VALUES (?, ?)
    `);

    const insertMany = this.repository.transaction(
      (studiosIds: (number | bigint)[]) => {
        for (const studioId of studiosIds) {
          insertStmt.run(movieId, studioId);
        }
      }
    );

    try {
      insertMany(studiosIds);
      return true;
    } catch (error) {
      return false;
    }
  }
}
