import { createReadStream } from "fs";
import csvParser from "csv-parser";
import { Low } from "lowdb";
import { Movie } from "@/entities/Movie";
import { injectable, inject } from "inversify";
import TYPES from "@/config/types";

@injectable()
export class DatabaseInitializerService {
  private repository: Low<{ movies: Movie[] }>;

  constructor(@inject(TYPES.Lowdb) repository: Low<{ movies: Movie[] }>) {
    this.repository = repository;
  }

  public async initializeDatabaseFromCSV(filePath: string): Promise<void> {
    try {
      const movies = await this.readCSVFile(filePath);
      this.repository.data.movies = movies;
      await this.repository.write();
      console.log("Database initialized with movies from CSV.");
    } catch (error) {
      console.error("Error during database initialization from CSV:", error);
    }
  }

  private readCSVFile(filePath: string): Promise<Movie[]> {
    return new Promise((resolve, reject) => {
      const movies: Movie[] = [];
      createReadStream(filePath)
        .pipe(csvParser())
        .on("data", (row) => {
          movies.push({
            year: parseInt(row.year, 10),
            title: row.title,
            studios: row.studios.split(","),
            producers: row.producers.split(","),
            winner: row.winner === "yes",
          });
        })
        .on("end", () => {
          resolve(movies);
        })
        .on("error", (error) => {
          reject(error);
        });
    });
  }
}
