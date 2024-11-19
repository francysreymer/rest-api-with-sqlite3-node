import Database from 'better-sqlite3';

import ProducerRepository from '@/repositories/ProducerRepository';
import { WinnerProducer } from '@/types/WinnerProducer';

describe('ProducerRepository', () => {
  let db: Database.Database;
  let producerRepository: ProducerRepository;

  beforeEach(() => {
    db = new Database(':memory:');
    producerRepository = new ProducerRepository(db);

    // Create tables
    db.exec(`
      CREATE TABLE producers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
      );
    `);

    db.exec(`
      CREATE TABLE movies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        year INTEGER NOT NULL,
        title TEXT NOT NULL,
        winner BOOLEAN NOT NULL
      );
    `);

    db.exec(`
      CREATE TABLE movie_producers (
        movie_id INTEGER NOT NULL,
        producer_id INTEGER NOT NULL,
        FOREIGN KEY (movie_id) REFERENCES movies(id),
        FOREIGN KEY (producer_id) REFERENCES producers(id)
      );
    `);

    // Insert test data
    db.exec(`
      INSERT INTO producers (name) VALUES ('Producer A');
      INSERT INTO producers (name) VALUES ('Producer B');
      INSERT INTO producers (name) VALUES ('Producer C');
      INSERT INTO movies (year, title, winner) VALUES (2000, 'First MAX Win', 1);
      INSERT INTO movies (year, title, winner) VALUES (2010, 'Second MAX Win', 1);
      INSERT INTO movies (year, title, winner) VALUES (2011, 'First MIN Win', 1);
      INSERT INTO movies (year, title, winner) VALUES (2011, 'Another Win', 1);
      INSERT INTO movies (year, title, winner) VALUES (2012, 'Second MIN Win', 1);
      INSERT INTO movie_producers (movie_id, producer_id) VALUES (1, 1);
      INSERT INTO movie_producers (movie_id, producer_id) VALUES (2, 1);
      INSERT INTO movie_producers (movie_id, producer_id) VALUES (3, 2);
      INSERT INTO movie_producers (movie_id, producer_id) VALUES (4, 3);
      INSERT INTO movie_producers (movie_id, producer_id) VALUES (5, 2);
    `);
  });

  afterEach(() => {
    db.close();
  });

  it('should find producers with the maximum award intervals', async () => {
    const result =
      await producerRepository.findProducersWithMaxAwardIntervals();

    // Define expected results based on the test data
    const expectedMaxWinners: WinnerProducer[] = [
      {
        producer: 'Producer A',
        interval: 10,
        previousWin: 2000,
        followingWin: 2010,
      },
    ];

    // Validate actual results against expected results
    expect(result).toEqual(expectedMaxWinners);
  });

  it('should find producers with the minimum award intervals', async () => {
    const result =
      await producerRepository.findProducersWithMinAwardIntervals();

    // Define expected results based on the test data
    const expectedMinWinners: WinnerProducer[] = [
      {
        producer: 'Producer B',
        interval: 1,
        previousWin: 2011,
        followingWin: 2012,
      },
    ];

    // Validate actual results against expected results
    expect(result).toEqual(expectedMinWinners);
  });

  it('should handle multiple producers with the same max and min intervals', async () => {
    // Insert additional test data to create multiple producers with the same intervals
    db.exec(`
      INSERT INTO producers (name) VALUES ('Producer D');
      INSERT INTO producers (name) VALUES ('Producer E');
      INSERT INTO movies (year, title, winner) VALUES (2000, 'Another First MAX Win', 1);
      INSERT INTO movies (year, title, winner) VALUES (2010, 'Another Second MAX Win', 1);
      INSERT INTO movies (year, title, winner) VALUES (2000, 'Another First MIN Win', 1);
      INSERT INTO movies (year, title, winner) VALUES (2001, 'Another Second MIN Win', 1);
      INSERT INTO movie_producers (movie_id, producer_id) VALUES (6, 4);
      INSERT INTO movie_producers (movie_id, producer_id) VALUES (7, 4);
      INSERT INTO movie_producers (movie_id, producer_id) VALUES (8, 5);
      INSERT INTO movie_producers (movie_id, producer_id) VALUES (9, 5);
    `);

    const maxResult =
      await producerRepository.findProducersWithMaxAwardIntervals();
    const minResult =
      await producerRepository.findProducersWithMinAwardIntervals();

    // Define expected results based on the test data
    const expectedMaxWinners: WinnerProducer[] = [
      {
        producer: 'Producer A',
        interval: 10,
        previousWin: 2000,
        followingWin: 2010,
      },
      {
        producer: 'Producer D',
        interval: 10,
        previousWin: 2000,
        followingWin: 2010,
      },
    ];

    const expectedMinWinners: WinnerProducer[] = [
      {
        producer: 'Producer B',
        interval: 1,
        previousWin: 2011,
        followingWin: 2012,
      },
      {
        producer: 'Producer E',
        interval: 1,
        previousWin: 2000,
        followingWin: 2001,
      },
    ];

    // Validate actual results against expected results
    expect(maxResult).toEqual(expectedMaxWinners);
    expect(minResult).toEqual(expectedMinWinners);
  });

  it('should not return intervals of zero', async () => {
    // Insert additional test data to create intervals of zero
    db.exec(`
      INSERT INTO producers (name) VALUES ('Producer F');
      INSERT INTO movies (year, title, winner) VALUES (2011, 'Zero Interval Win 1', 1);
      INSERT INTO movies (year, title, winner) VALUES (2011, 'Zero Interval Win 2', 1);
      INSERT INTO movie_producers (movie_id, producer_id) VALUES (6, 4);
      INSERT INTO movie_producers (movie_id, producer_id) VALUES (7, 4);
    `);

    const minResult =
      await producerRepository.findProducersWithMinAwardIntervals();

    // Define expected results based on the test data
    const expectedMinWinners: WinnerProducer[] = [
      {
        producer: 'Producer B',
        interval: 1,
        previousWin: 2011,
        followingWin: 2012,
      },
    ];

    // Validate actual results against expected results
    expect(minResult).toEqual(expectedMinWinners);
  });
});
