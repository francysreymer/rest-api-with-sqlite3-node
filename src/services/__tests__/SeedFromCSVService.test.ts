import { writeFileSync, unlinkSync } from "fs";
import path from "path";
import SeedFromCSVService from "@/services/SeedFromCSVService";
import MovieRepository from "@/repositories/MovieRepository";
import ProducerRepository from "@/repositories/ProducerRepository";
import StudioRepository from "@/repositories/StudioRepository";
import Database from "better-sqlite3";
import { Container } from "inversify";
import TYPES from "@/config/types";

describe("SeedFromCSVService", () => {
  let db: Database.Database;
  let seedService: SeedFromCSVService;
  let movieRepository: MovieRepository;
  let producerRepository: ProducerRepository;
  let studioRepository: StudioRepository;
  const tempFilePath = path.join(__dirname, "testData.csv");

  beforeEach(() => {
    db = new Database(":memory:");
    movieRepository = new MovieRepository(db);
    producerRepository = new ProducerRepository(db);
    studioRepository = new StudioRepository(db);

    const container = new Container();
    container
      .bind<MovieRepository>(TYPES.IMovieRepository)
      .toConstantValue(movieRepository);
    container
      .bind<ProducerRepository>(TYPES.IProducerRepository)
      .toConstantValue(producerRepository);
    container
      .bind<StudioRepository>(TYPES.IStudioRepository)
      .toConstantValue(studioRepository);

    seedService = new SeedFromCSVService(
      movieRepository,
      producerRepository,
      studioRepository
    );

    // Create tables
    db.exec(`
      CREATE TABLE producers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
      );
    `);

    db.exec(`
      CREATE TABLE movies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        year INTEGER NOT NULL,
        title TEXT NOT NULL,
        winner BOOLEAN NOT NULL
      );
    `);

    db.exec(`
      CREATE TABLE studios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
      );
    `);

    db.exec(`
      CREATE TABLE movie_producers (
        movie_id INTEGER NOT NULL,
        producer_id INTEGER NOT NULL,
        FOREIGN KEY (movie_id) REFERENCES movies(id),
        FOREIGN KEY (producer_id) REFERENCES producers(id)
      );
    `);

    db.exec(`
      CREATE TABLE movie_studios (
        movie_id INTEGER NOT NULL,
        studio_id INTEGER NOT NULL,
        FOREIGN KEY (movie_id) REFERENCES movies(id),
        FOREIGN KEY (studio_id) REFERENCES studios(id)
      );
    `);

    // Create a temporary CSV file with sample data
    writeFileSync(
      tempFilePath,
      "year;title;studios;producers;winner\n2000;First Win;Studio A;Producer A;yes\n2010;Second Win;Studio B;Producer A;yes\n2011;Single Win;Studio C;Producer B;yes\n"
    );
  });

  afterEach(() => {
    // Clean up the temporary file
    unlinkSync(tempFilePath);
    db.close();
  });

  it("should parse CSV and initialize data correctly", async () => {
    await seedService.initializeDataFrom(tempFilePath);

    // Verify movies
    const movies = db.prepare("SELECT * FROM movies").all();
    expect(movies).toHaveLength(3);
    expect(movies).toEqual([
      { id: 1, year: 2000, title: "First Win", winner: 1 },
      { id: 2, year: 2010, title: "Second Win", winner: 1 },
      { id: 3, year: 2011, title: "Single Win", winner: 1 },
    ]);

    // Verify producers
    const producers = db.prepare("SELECT * FROM producers").all();
    expect(producers).toHaveLength(2);
    expect(producers).toEqual([
      { id: 1, name: "Producer A" },
      { id: 2, name: "Producer B" },
    ]);

    // Verify studios
    const studios = db.prepare("SELECT * FROM studios").all();
    expect(studios).toHaveLength(3);
    expect(studios).toEqual([
      { id: 1, name: "Studio A" },
      { id: 2, name: "Studio B" },
      { id: 3, name: "Studio C" },
    ]);

    // Verify movie_producers
    const movieProducers = db.prepare("SELECT * FROM movie_producers").all();
    expect(movieProducers).toHaveLength(3);
    expect(movieProducers).toEqual([
      { movie_id: 1, producer_id: 1 },
      { movie_id: 2, producer_id: 1 },
      { movie_id: 3, producer_id: 2 },
    ]);

    // Verify movie_studios
    const movieStudios = db.prepare("SELECT * FROM movie_studios").all();
    expect(movieStudios).toHaveLength(3);
    expect(movieStudios).toEqual([
      { movie_id: 1, studio_id: 1 },
      { movie_id: 2, studio_id: 2 },
      { movie_id: 3, studio_id: 3 },
    ]);
  });
});
