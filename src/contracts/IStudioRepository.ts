import { Studio } from '@/entities/Studio';

export default interface IStudioRepository {
  save(studio: Studio): Promise<Studio>;
  findById(id: number | bigint): Promise<Studio | null>;
  findByName(name: string): Promise<Studio | null>;
}
