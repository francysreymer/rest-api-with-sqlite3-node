import { Producer } from "@/entities/Producer";
import { WinnerProducer } from "@/types/WinnerProducer";

export default interface IProducerRepository {
  save(producer: Producer): Promise<Producer>;
  findById(id: number | bigint): Promise<Producer | null>;
  findByName(name: string): Promise<Producer | null>;
  findProducersWithMaxAwardIntervals(): Promise<WinnerProducer[] | []>;
  findProducersWithMinAwardIntervals(): Promise<WinnerProducer[] | []>;
}
