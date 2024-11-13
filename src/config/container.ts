import "reflect-metadata";
import { Container } from "inversify";
import IMovieRepository from "@/contracts/IMovieRepository";
import IProducerRepository from "@/contracts/IProducerRepository";
import IStudioRepository from "@/contracts/IStudioRepository";
import MovieRepository from "@/repositories/MovieRepository";
import ProducerRepository from "@/repositories/ProducerRepository";
import StudioRepository from "@/repositories/StudioRepository";
import IMovieAwardService from "@/contracts/IMovieAwardService";
import MovieAwardService from "@/services/MovieAwardService";
import SeedFromCSVService from "@/services/SeedFromCSVService";
import MigrationService from "@/services/MigrationService";
import TYPES from "@/config/types";
import db from "@/config/db";
import MovieAwardController from "@/controllers/MovieAwardController";

const container = new Container();

container.bind<IMovieRepository>(TYPES.IMovieRepository).to(MovieRepository);
container
  .bind<IProducerRepository>(TYPES.IProducerRepository)
  .to(ProducerRepository);
container.bind<IStudioRepository>(TYPES.IStudioRepository).to(StudioRepository);
container
  .bind<IMovieAwardService>(TYPES.IMovieAwardService)
  .to(MovieAwardService);
container.bind(TYPES.DB).toConstantValue(db);
container.bind<MigrationService>(TYPES.MigrationService).to(MigrationService);
container
  .bind<SeedFromCSVService>(TYPES.SeedFromCSVService)
  .to(SeedFromCSVService);
container
  .bind<MovieAwardController>(TYPES.MovieAwardController)
  .to(MovieAwardController);

export default container;
