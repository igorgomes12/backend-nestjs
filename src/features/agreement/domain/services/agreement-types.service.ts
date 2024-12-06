import type { AgreementDTO } from "../dto/agreement.dto";
import type { AgreementEntity } from "../entity/agreement.entity";

export abstract class AgreementTypeService {
  abstract findAll(): Promise<AgreementEntity[]>;
  abstract findById(id: number): Promise<AgreementEntity | null>;
  abstract create(user: AgreementDTO): Promise<AgreementEntity>;
  abstract update(
    id: number,
    user: Partial<AgreementEntity>
  ): Promise<AgreementEntity>;
  abstract delete(id: number): Promise<void>;
}
