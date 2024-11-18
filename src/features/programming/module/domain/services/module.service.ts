import { TModuleSchemaDto } from "../dto/module.dto";
import { CreateModuleEntity } from "../entity/create.entity";

export abstract class ModuleServiceTypes {
  abstract create(module: TModuleSchemaDto): Promise<CreateModuleEntity>;
  abstract findAll(): Promise<CreateModuleEntity[]>;
  abstract findById(id: number): Promise<CreateModuleEntity>;
  abstract update(module: TModuleSchemaDto): Promise<CreateModuleEntity>;
  abstract delete(id: number): Promise<void>;

  abstract findName(name: string): Promise<CreateModuleEntity>;
}
