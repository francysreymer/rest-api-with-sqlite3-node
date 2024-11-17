import "reflect-metadata";
import express from "express";
import movieAwardRoutes from "@/routes/movieAwardRoutes";
import container from "@/config/container";
import TYPES from "@/config/types";
import SeedFromCSVService from "@/services/SeedFromCSVService";
import MigrationService from "@/services/MigrationService";
import dotenvSafe from "dotenv-safe";

// Load environment variables from .env file and ensure required variables are set
dotenvSafe.config({
  allowEmptyValues: true,
});

const app = express();
app.use(express.json());
app.use("/api", movieAwardRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  const migrationService = container.get<MigrationService>(
    TYPES.MigrationService
  );
  await migrationService.runMigrations();

  const seedFromCSVService = container.get<SeedFromCSVService>(
    TYPES.SeedFromCSVService
  );
  await seedFromCSVService.initializeDataFrom("./temp/movielist.csv");
  console.log(`Server running on port ${PORT}`);
});
