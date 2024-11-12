import "reflect-metadata";
import express from "express";
import userRoutes from "@/routes/userRoutes";
import container from "@/config/container";
import TYPES from "@/config/types";
import { DatabaseInitializerService } from "@/services/DatabaseInitializerService";

const app = express();
app.use(express.json());
//app.use("/api", userRoutes);

const PORT = 3002;

app.listen(PORT, async () => {
  const dbInitializerService = container.get<DatabaseInitializerService>(
    TYPES.DatabaseInitializerService
  );
  await dbInitializerService.initializeDatabaseFromCSV("teste.csv");
  console.log(`Server running on port ${PORT}`);
});
