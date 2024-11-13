import { injectable, inject } from "inversify";
import Database from "better-sqlite3";
import { Producer } from "@/entities/Producer";
import IProducerRepository from "@/contracts/IProducerRepository";
import TYPES from "@/config/types";
import { WinnerProducer } from "@/types/WinnerProducer";

type AwardRow = {
  producer: string;
  win_year: number;
};

@injectable()
export default class ProducerRepository implements IProducerRepository {
  private repository: Database.Database;

  constructor(@inject(TYPES.DB) repository: Database.Database) {
    this.repository = repository;
  }

  async save(Producer: Producer): Promise<Producer> {
    const stmt = this.repository.prepare(`
      INSERT INTO producers (name)
      VALUES (?)
    `);

    const info = stmt.run(Producer.name);
    const savedProducer = await this.findById(info.lastInsertRowid);

    if (!savedProducer) {
      throw new Error("Failed to save Producer");
    }

    return savedProducer;
  }

  async findById(id: number | bigint): Promise<Producer | null> {
    const stmt = this.repository.prepare(`
      SELECT * FROM producers WHERE id = ?
    `);
    const producer = stmt.get(id) as Producer | undefined;
    return producer || null;
  }

  async findByName(name: string): Promise<Producer | null> {
    const stmt = this.repository.prepare(`
      SELECT * FROM producers WHERE name = ?
    `);
    const studio = stmt.get(name) as Producer | undefined;
    return studio || null;
  }

  async findProducersWithMaxAwardIntervals(): Promise<WinnerProducer[]> {
    const stmt = this.repository.prepare(`
      WITH intervals AS (
        SELECT 
          p.name AS producer,
          m.year AS win_year,
          LAG(m.year) OVER (PARTITION BY p.name ORDER BY m.year) AS previous_win_year,
          (m.year - LAG(m.year) OVER (PARTITION BY p.name ORDER BY m.year)) AS interval
        FROM 
          producers p
          JOIN movie_producers mp ON p.id = mp.producer_id
          JOIN movies m ON mp.movie_id = m.id
        WHERE 
          m.winner = 1
      )
      SELECT 
        producer, 
        interval, 
        previous_win_year AS previousWin, 
        win_year AS followingWin
      FROM 
        intervals
      WHERE 
        interval IS NOT NULL
        AND interval = (SELECT MAX(interval) FROM intervals WHERE interval IS NOT NULL)
    `);

    const rows = stmt.all() as WinnerProducer[];

    return rows.filter((row) => row.interval > 0);
  }

  async findProducersWithMinAwardIntervals(): Promise<WinnerProducer[]> {
    const stmt = this.repository.prepare(`
      WITH intervals AS (
        SELECT 
          p.name AS producer,
          m.year AS win_year,
          LAG(m.year) OVER (PARTITION BY p.name ORDER BY m.year) AS previous_win_year,
          (m.year - LAG(m.year) OVER (PARTITION BY p.name ORDER BY m.year)) AS interval
        FROM 
          producers p
          JOIN movie_producers mp ON p.id = mp.producer_id
          JOIN movies m ON mp.movie_id = m.id
        WHERE 
          m.winner = 1
      )
      SELECT 
        producer, 
        interval, 
        previous_win_year AS previousWin, 
        win_year AS followingWin
      FROM 
        intervals
      WHERE 
        interval IS NOT NULL
        AND interval = (SELECT MIN(interval) FROM intervals WHERE interval IS NOT NULL)
    `);

    const rows = stmt.all() as WinnerProducer[];

    return rows.filter((row) => row.interval > 0);
  }
}
