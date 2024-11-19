import 'reflect-metadata';
import dotenvSafe from 'dotenv-safe';
import express from 'express';

import container from '@/config/container';
import TYPES from '@/config/types';
import movieAwardRoutes from '@/routes/movieAwardRoutes';
import MigrationService from '@/services/MigrationService';
import SeedFromCSVService from '@/services/SeedFromCSVService';

// Load environment variables from .env file and ensure required variables are set
dotenvSafe.config({
  allowEmptyValues: true,
});

const app = express();
app.use(express.json());
app.use('/api', movieAwardRoutes);

const PORT = process.env.PORT || 3000;

(async () => {
  const migrationService = container.get<MigrationService>(
    TYPES.MigrationService,
  );
  await migrationService.runMigrations();

  const seedFromCSVService = container.get<SeedFromCSVService>(
    TYPES.SeedFromCSVService,
  );
  await seedFromCSVService.initializeDataFrom('./temp/movielist.csv');
})();

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
});
