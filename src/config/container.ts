import "reflect-metadata";
import { Container } from "inversify";
import IMovieRepository from "@/contracts/IMovieRepository";
import { MovieRepository } from "@/repositories/MovieRepository";
import IMovieService from "@/contracts/IMovieService";
import { MovieService } from "@/services/MovieService";
import { DatabaseInitializerService } from "@/services/DatabaseInitializerService";
import TYPES from "@/config/types";
import db from "@/config/db";

const container = new Container();

container.bind<IMovieRepository>(TYPES.IMovieRepository).to(MovieRepository);
container.bind<IMovieService>(TYPES.IMovieService).to(MovieService);
container.bind(TYPES.Lowdb).toConstantValue(db);
container.bind(DatabaseInitializerService).toSelf();

export default container;
