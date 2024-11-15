import { Router } from "express";
import container from "@/config/container";
import TYPES from "@/config/types";
import MovieAwardController from "@/controllers/MovieAwardController";

const movieAwardRoutes = Router();
const movieAwardController = container.get<MovieAwardController>(
  TYPES.MovieAwardController
);

movieAwardRoutes.get("/movies/producers/award-intervals", async (req, res) => {
  await movieAwardController.getProducersWithMaxAndMinAwardIntervals(req, res);
});

export default movieAwardRoutes;
