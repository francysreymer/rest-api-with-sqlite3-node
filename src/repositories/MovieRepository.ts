import Database from 'better-sqlite3';
import { injectable, inject } from 'inversify';

import TYPES from '@/config/types';
import IMovieRepository from '@/contracts/IMovieRepository';
import { Movie } from '@/entities/Movie';

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
      throw new Error('Failed to save movie');
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
    producersIds: (number | bigint)[],
  ): Promise<void> {
    try {
      const insertMany = this.repository.transaction(
        (producersIds: (number | bigint)[]) => {
          const stmt = this.repository.prepare(`
          INSERT INTO movie_producers (movie_id, producer_id)
          VALUES (?, ?)
        `);
          for (const producerId of producersIds) {
            stmt.run(movieId, producerId);
          }
        },
      );

      insertMany(producersIds);
    } catch (error) {
      console.error('Error inserting producers:', error);
      throw new Error('Failed to insert producers');
    }
  }

  async saveManyStudios(
    movieId: number | bigint,
    studiosIds: (number | bigint)[],
  ): Promise<void> {
    try {
      const insertMany = this.repository.transaction(
        (studiosIds: (number | bigint)[]) => {
          const stmt = this.repository.prepare(`
          INSERT INTO movie_studios (movie_id, studio_id)
          VALUES (?, ?)
        `);
          for (const studioId of studiosIds) {
            stmt.run(movieId, studioId);
          }
        },
      );

      insertMany(studiosIds);
    } catch (error) {
      console.error('Error inserting studios:', error);
      throw new Error('Failed to insert studios');
    }
  }
}
