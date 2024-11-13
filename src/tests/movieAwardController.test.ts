import request from "supertest";
import express from "express";
import movieAwardRoutes from "@/routes/movieAwardRoutes";
import { createReadStream, readFileSync } from "fs";
import { Readable } from "stream";
import container from "@/config/container";
import TYPES from "@/config/types";
import SeedFromCSVService from "@/services/SeedFromCSVService";
import MigrationService from "@/services/MigrationService";

// Mock the fs module
jest.mock("fs", () => ({
  createReadStream: jest.fn(),
}));

// Mock the better-sqlite3 module
jest.mock("better-sqlite3");

const app = express();
app.use(express.json());
app.use("/api", movieAwardRoutes);

describe("GET /movies/producers/award-intervals", () => {
  beforeAll(async () => {
    // Read the CSV data from the file
    const csvData = readFileSync("/temp/movielist.csv", "utf-8");

    // Mock the createReadStream function to return the CSV data
    (createReadStream as jest.Mock).mockImplementation(() => {
      const readable = new Readable();
      readable._read = () => {}; // _read is required but you can noop it
      readable.push(csvData);
      readable.push(null);
      return readable;
    });

    // Run migrations
    const migrationService = container.get<MigrationService>(
      TYPES.MigrationService
    );
    await migrationService.runMigrations();

    // Initialize the database with mock data
    const seedFromCSVService = container.get<SeedFromCSVService>(
      TYPES.SeedFromCSVService
    );
    await seedFromCSVService.initializeDataFrom("mocked-path.csv");
  });

  it("should return producers with max and min award intervals", async () => {
    const response = await request(app).get(
      "/api/movies/producers/award-intervals"
    );
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("max");
    expect(response.body).toHaveProperty("min");

    // Verificar se os dados retornados estão corretos
    expect(response.body.max).toEqual([
      {
        producer: "Mitsuharu Ishii",
        interval: 1,
        previousWin: 1981,
        followingWin: 1982,
      },
    ]);

    expect(response.body.min).toEqual([
      {
        producer: "Frank Yablans",
        interval: 1,
        previousWin: 1981,
        followingWin: 1982,
      },
    ]);
  });
});
