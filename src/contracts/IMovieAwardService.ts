import { WinnerProducer } from "@/types/WinnerProducer";

export default interface IMovieAwardService {
  getProducersWithMaxAndMinAwardIntervals(): Promise<{
    max: WinnerProducer[] | [];
    min: WinnerProducer[] | [];
  }>;
}
