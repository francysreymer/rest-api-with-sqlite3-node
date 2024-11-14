import express from "express";
import request from "supertest";
import { WinnerProducer } from "@/types/WinnerProducer";
import { writeFileSync, unlinkSync, existsSync } from "fs";
import path from "path";
import SeedFromCSVService from "@/services/SeedFromCSVService";
import MigrationService from "@/services/MigrationService";
import TYPES from "@/config/types";
import movieAwardRoutes from "@/routes/movieAwardRoutes";
import container from "@/config/container";

const URL_API = "/api/movies/producers/award-intervals";
const tempFilePath = path.join(__dirname, "testData.csv");
const writeCSVData = (data: string) => {
  writeFileSync(tempFilePath, data);
};

// Set up the Express app
const app = express();
app.use(express.json());
app.use("/api", movieAwardRoutes);

describe("MovieAwardController", () => {
  const migrationService = container.get<MigrationService>(
    TYPES.MigrationService
  );

  beforeEach(async () => {
    //Run migrations before each test
    await migrationService.runMigrations();
  });

  afterEach(async () => {
    // Clean up the temporary file
    if (existsSync(tempFilePath)) {
      unlinkSync(tempFilePath);
    }

    await migrationService.revertMigrations();
  });

  it("should return producers with the maximum award intervals", async () => {
    // Create a temporary CSV file with sample data
    writeCSVData(
      "year;title;studios;producers;winner\n2000;First Win;Studio A;Producer A;yes\n2010;Second Win;Studio B;Producer A;yes\n2011;Single Win;Studio C;Producer B;yes\n"
    );

    // Seed the database
    const seedService = container.get<SeedFromCSVService>(
      TYPES.SeedFromCSVService
    );
    await seedService.initializeDataFrom(tempFilePath);

    const response = await request(app).get(URL_API);

    const expectedMaxWinners: WinnerProducer[] = [
      {
        producer: "Producer A",
        interval: 10,
        previousWin: 2000,
        followingWin: 2010,
      },
    ];

    expect(response.status).toBe(200);
    expect(response.body.max).toEqual(expectedMaxWinners);
  });

  it("should return producers with the minimum award intervals", async () => {
    // Create a temporary CSV file with different sample data
    writeCSVData(
      "year;title;studios;producers;winner\n2000;First Win;Studio A;Producer A;yes\n2011;Single Win;Studio C;Producer B;yes\n2012;Second Win;Studio B;Producer A;yes\n2013;Single Win 2;Studio E;Producer B;yes\n"
    );

    // Seed the database
    const seedService = container.get<SeedFromCSVService>(
      TYPES.SeedFromCSVService
    );
    await seedService.initializeDataFrom(tempFilePath);

    const response = await request(app).get(URL_API);

    const expectedMinWinners: WinnerProducer[] = [
      {
        producer: "Producer B",
        interval: 2,
        previousWin: 2011,
        followingWin: 2013,
      },
    ];

    expect(response.status).toBe(200);
    expect(response.body.min).toEqual(expectedMinWinners);
  });

  it("should handle multiple producers with the same max and min intervals", async () => {
    // Create a temporary CSV file with different sample data
    writeCSVData(
      "year;title;studios;producers;winner\n2012;First Win Test;Studio A;Producer B;yes\n2000;First Win;Studio A;Producer A;yes\n2010;Second Win;Studio B;Producer A;yes\n2011;Single Win;Studio C;Producer B;yes\n2000;Another First MAX Win;Studio D;Producer D;yes\n2010;Another Second MAX Win;Studio E;Producer D;yes\n2000;Another First MIN Win;Studio F;Producer E;yes\n2001;Another Second MIN Win;Studio G;Producer E;yes\n"
    );

    // Seed the database
    const seedService = container.get<SeedFromCSVService>(
      TYPES.SeedFromCSVService
    );
    await seedService.initializeDataFrom(tempFilePath);

    const response = await request(app).get(URL_API);

    const expectedMaxWinners: WinnerProducer[] = [
      {
        producer: "Producer A",
        interval: 10,
        previousWin: 2000,
        followingWin: 2010,
      },
      {
        producer: "Producer D",
        interval: 10,
        previousWin: 2000,
        followingWin: 2010,
      },
    ];

    const expectedMinWinners: WinnerProducer[] = [
      {
        producer: "Producer B",
        interval: 1,
        previousWin: 2011,
        followingWin: 2012,
      },
      {
        producer: "Producer E",
        interval: 1,
        previousWin: 2000,
        followingWin: 2001,
      },
    ];

    expect(response.status).toBe(200);
    expect(response.body.max).toEqual(expectedMaxWinners);
    expect(response.body.min).toEqual(expectedMinWinners);
  });

  it("should not return intervals of zero", async () => {
    // Create a temporary CSV file with different sample data
    writeCSVData(
      "year;title;studios;producers;winner\n2011;Zero Interval Win 1;Studio A;Producer A;yes\n2011;Zero Interval Win 2;Studio B;Producer A;yes\n"
    );

    // Seed the database
    const seedService = container.get<SeedFromCSVService>(
      TYPES.SeedFromCSVService
    );
    await seedService.initializeDataFrom(tempFilePath);

    const response = await request(app).get(URL_API);

    const expectedMinWinners: WinnerProducer[] = [];
    const expectedMaxWinners: WinnerProducer[] = [];

    expect(response.status).toBe(200);
    expect(response.body.min).toEqual(expectedMinWinners);
    expect(response.body.max).toEqual(expectedMaxWinners);
  });

  it("should return empty arrays when there are no winners", async () => {
    // Create a temporary CSV file with different sample data
    writeCSVData(
      "year;title;studios;producers;winner\n2011;No Winners 1;Studio A;Producer A;no\n2011;No Winners 2;Studio B;Producer A;no\n"
    );

    // Seed the database
    const seedService = container.get<SeedFromCSVService>(
      TYPES.SeedFromCSVService
    );
    await seedService.initializeDataFrom(tempFilePath);

    const response = await request(app).get(URL_API);

    const expectedMinWinners: WinnerProducer[] = [];
    const expectedMaxWinners: WinnerProducer[] = [];

    expect(response.status).toBe(200);
    expect(response.body.min).toEqual(expectedMinWinners);
    expect(response.body.max).toEqual(expectedMaxWinners);
  });
});
