import { injectable, inject } from "inversify";
import IProducerRepository from "@/contracts/IProducerRepository";
import IMovieAwardService from "@/contracts/IMovieAwardService";
import TYPES from "@/config/types";
import { WinnerProducer } from "@/types/WinnerProducer";

@injectable()
export default class MovieAwardService implements IMovieAwardService {
  private producerRepository: IProducerRepository;

  constructor(
    @inject(TYPES.IProducerRepository) producerRepository: IProducerRepository
  ) {
    this.producerRepository = producerRepository;
  }

  async getProducersWithMaxAndMinAwardIntervals(): Promise<{
    min: WinnerProducer[] | [];
    max: WinnerProducer[] | [];
  }> {
    const [producersWithMaxAwardIntervals, producersWithMinAwardIntervals] =
      await Promise.all([
        this.producerRepository.findProducersWithMaxAwardIntervals(),
        this.producerRepository.findProducersWithMinAwardIntervals(),
      ]);

    return {
      min: producersWithMinAwardIntervals,
      max: producersWithMaxAwardIntervals,
    };
  }
}
