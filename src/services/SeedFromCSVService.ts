import csvParser from 'csv-parser';
import { createReadStream } from 'fs';
import { injectable, inject } from 'inversify';

import TYPES from '@/config/types';
import IMovieRepository from '@/contracts/IMovieRepository';
import IProducerRepository from '@/contracts/IProducerRepository';
import IStudioRepository from '@/contracts/IStudioRepository';
import { Movie } from '@/entities/Movie';

type MovieAward = {
  year: number;
  title: string;
  studios: string[];
  producers: string[];
  winner: number;
};

@injectable()
export default class SeedFromCSVService {
  private movieRepository: IMovieRepository;
  private producerRepository: IProducerRepository;
  private studioRepository: IStudioRepository;

  constructor(
    @inject(TYPES.IMovieRepository) movieRepository: IMovieRepository,
    @inject(TYPES.IProducerRepository) producerRepository: IProducerRepository,
    @inject(TYPES.IStudioRepository) studioRepository: IStudioRepository,
  ) {
    this.movieRepository = movieRepository;
    this.producerRepository = producerRepository;
    this.studioRepository = studioRepository;
  }

  public async initializeDataFrom(filePath: string): Promise<void> {
    try {
      const moviesAwards = await this.readCSVFile(filePath);
      for (const movieAward of moviesAwards) {
        const movie: Movie = {
          title: movieAward.title,
          year: movieAward.year,
          winner: movieAward.winner,
        };
        const savedMovie = await this.movieRepository.save(movie);

        if (!savedMovie || savedMovie.id === undefined) {
          throw new Error('Failed to initialize the database');
        }

        const [producerIds, studioIds] = await Promise.all([
          Promise.all(
            movieAward.producers.map(async (producerName) => {
              try {
                let producer =
                  await this.producerRepository.findByName(producerName);
                if (!producer) {
                  producer = await this.producerRepository.save({
                    name: producerName,
                  });
                }
                return producer.id;
              } catch (error) {
                console.error(`Error saving producer ${producerName}:`, error);
                return null; // Return null if there's an error
              }
            }),
          ),
          Promise.all(
            movieAward.studios.map(async (studioName) => {
              try {
                let studio = await this.studioRepository.findByName(studioName);
                if (!studio) {
                  studio = await this.studioRepository.save({
                    name: studioName,
                  });
                }
                return studio.id;
              } catch (error) {
                console.error(`Error saving studio ${studioName}:`, error);
                return null; // Return null if there's an error
              }
            }),
          ),
        ]);

        // Filter out undefined values
        const validProducerIds = producerIds.filter(
          (id): id is number | bigint => id !== null,
        );
        const validStudioIds = studioIds.filter(
          (id): id is number | bigint => id !== null,
        );

        await Promise.all([
          this.movieRepository.saveManyProducers(
            savedMovie.id,
            validProducerIds,
          ),
          this.movieRepository.saveManyStudios(savedMovie.id, validStudioIds),
        ]);
      }
    } catch (error) {
      console.error('Error during database initialization from CSV:', error);
    }
  }

  private readCSVFile(filePath: string): Promise<MovieAward[]> {
    return new Promise((resolve, reject) => {
      const moviesAwards: MovieAward[] = [];
      createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row) => {
          // Concatenate all columns into a single string
          const rowData = Object.values(row).join(',');
          const [year, title, studios, producers, winner] = rowData.split(';');
          moviesAwards.push({
            year: parseInt(year, 10),
            title: title.trim(),
            studios: this.splitByCommaAndAnd(studios),
            producers: this.splitByCommaAndAnd(producers),
            winner: winner.trim().toLowerCase() === 'yes' ? 1 : 0,
          });
        })
        .on('end', () => {
          resolve(moviesAwards);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  private splitByCommaAndAnd(input: string): string[] {
    return input
      .replace(/,?\s*and\s+/g, ',') // Replace ", and" or "and" with ","
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }
}
