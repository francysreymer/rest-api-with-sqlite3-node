import Database from 'better-sqlite3';
import { injectable, inject } from 'inversify';

import TYPES from '@/config/types';

@injectable()
export default class MigrationService {
  private db: Database.Database;

  constructor(@inject(TYPES.DB) db: Database.Database) {
    this.db = db;
  }

  public async runMigrations(): Promise<void> {
    await Promise.all([
      this.createStudiosTable(),
      this.createProducersTable(),
      this.createMoviesTable(),
    ]);
    await Promise.all([
      this.createMovieStudiosTable(),
      this.createMovieProducersTable(),
    ]);
  }

  public async revertMigrations(): Promise<void> {
    await Promise.all([
      this.dropMovieProducersTable(),
      this.dropMovieStudiosTable(),
    ]);
    await Promise.all([
      this.dropMoviesTable(),
      this.dropProducersTable(),
      this.dropStudiosTable(),
    ]);
  }

  private async createStudiosTable(): Promise<void> {
    this.db
      .prepare(
        `
        CREATE TABLE IF NOT EXISTS studios (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE
        )
      `,
      )
      .run();
  }

  private async createProducersTable(): Promise<void> {
    this.db
      .prepare(
        `
        CREATE TABLE IF NOT EXISTS producers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE
        )
      `,
      )
      .run();
  }

  private async createMoviesTable(): Promise<void> {
    this.db
      .prepare(
        `
        CREATE TABLE IF NOT EXISTS movies (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT,
          year INTEGER,
          winner INTEGER  -- Use INTEGER for boolean values (0 or 1)
        )
      `,
      )
      .run();
  }

  private async createMovieStudiosTable(): Promise<void> {
    this.db
      .prepare(
        `
        CREATE TABLE IF NOT EXISTS movie_studios (
          movie_id INTEGER,
          studio_id INTEGER,
          FOREIGN KEY(movie_id) REFERENCES movies(id),
          FOREIGN KEY(studio_id) REFERENCES studios(id),
          PRIMARY KEY (movie_id, studio_id)
        )
      `,
      )
      .run();
  }

  private async createMovieProducersTable(): Promise<void> {
    this.db
      .prepare(
        `
        CREATE TABLE IF NOT EXISTS movie_producers (
          movie_id INTEGER,
          producer_id INTEGER,
          FOREIGN KEY(movie_id) REFERENCES movies(id),
          FOREIGN KEY(producer_id) REFERENCES producers(id),
          PRIMARY KEY (movie_id, producer_id)
        )
      `,
      )
      .run();
  }

  private async dropStudiosTable(): Promise<void> {
    this.db.prepare(`DROP TABLE IF EXISTS studios`).run();
  }

  private async dropProducersTable(): Promise<void> {
    this.db.prepare(`DROP TABLE IF EXISTS producers`).run();
  }

  private async dropMoviesTable(): Promise<void> {
    this.db.prepare(`DROP TABLE IF EXISTS movies`).run();
  }

  private async dropMovieStudiosTable(): Promise<void> {
    this.db.prepare(`DROP TABLE IF EXISTS movie_studios`).run();
  }

  private async dropMovieProducersTable(): Promise<void> {
    this.db.prepare(`DROP TABLE IF EXISTS movie_producers`).run();
  }
}
