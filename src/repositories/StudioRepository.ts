import { injectable, inject } from "inversify";
import Database from "better-sqlite3";
import { Studio } from "@/entities/Studio";
import IStudioRepository from "@/contracts/IStudioRepository";
import TYPES from "@/config/types";

@injectable()
export default class StudioRepository implements IStudioRepository {
  private repository: Database.Database;

  constructor(@inject(TYPES.DB) repository: Database.Database) {
    this.repository = repository;
  }

  async save(studio: Studio): Promise<Studio> {
    const stmt = this.repository.prepare(`
      INSERT INTO studios (name)
      VALUES (?)
    `);

    const info = stmt.run(studio.name);
    const savedStudio = await this.findById(info.lastInsertRowid);

    if (!savedStudio) {
      throw new Error("Failed to save studio");
    }

    return savedStudio;
  }

  async findById(id: number | bigint): Promise<Studio | null> {
    const stmt = this.repository.prepare(`
      SELECT * FROM studios WHERE id = ?
    `);
    const studio = stmt.get(id) as Studio | undefined;
    return studio || null;
  }

  async findByName(name: string): Promise<Studio | null> {
    const stmt = this.repository.prepare(`
      SELECT * FROM studios WHERE LOWER(name) = LOWER(?)
    `);
    const studio = stmt.get(name) as Studio | undefined;
    return studio || null;
  }
}
