const TYPES = {
  IMovieRepository: Symbol.for("IMovieRepository"),
  IProducerRepository: Symbol.for("IProducerRepository"),
  IStudioRepository: Symbol.for("IStudioRepository"),
  IMovieAwardService: Symbol.for("IMovieAwardService"),
  DB: Symbol.for("Database"),
  MigrationService: Symbol.for("MigrationService"),
  SeedFromCSVService: Symbol.for("SeedFromCSVService"),
  MovieAwardController: Symbol.for("MovieAwardController"),
};

export default TYPES;
