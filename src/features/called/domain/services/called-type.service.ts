import type { CalledDto } from "../dto/called.dto";
import type { CalledEntity } from "../entity/called.entity";

export abstract class CalledTypeService {
  abstract findAll(params: CalledDto): Promise<CalledEntity[]>;
  abstract findById(id: number): Promise<CalledEntity | null>;
  abstract create(user: CalledDto): Promise<CalledEntity>;
  abstract update(
    id: number,
    user: Partial<CalledEntity>
  ): Promise<CalledEntity>;
  abstract delete(id: number): Promise<void>;
  abstract findByName(name: string): Promise<CalledEntity | null>;
}
