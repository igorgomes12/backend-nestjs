import type { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import {
  ModuleSchemaDto,
  type TModuleSchemaDto,
} from "features/programming/module/domain/dto/module.dto";
import { CreateModuleEntity } from "features/programming/module/domain/entity/create.entity";
import { ModuleServiceTypes } from "features/programming/module/domain/services/module.service";
import { Logger } from "@nestjs/common";

export class ModulePrismaService extends ModuleServiceTypes {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findName(name: string): Promise<CreateModuleEntity> {
    const res = await this.prisma.module.findFirst({
      where: { module: name },
    });
    return res;
  }

  async create(modules: TModuleSchemaDto): Promise<CreateModuleEntity> {
    const value = ModuleSchemaDto.parse(modules);
    const { module } = value;
    const existingModule = await this.prisma.module.findFirst({
      where: { module },
    });
    if (existingModule) {
      throw new Error("Modulo com o mesmo nome já existe!");
    }
    return this.prisma.module.create({
      data: {
        module: value.module,
        system: value.system,
        status: value.status,
      },
    });
  }
  async findAll(): Promise<CreateModuleEntity[]> {
    const res = await this.prisma.module.findMany({
      orderBy: {
        id: "asc",
      },
    });
    return res.map(
      (module) =>
        new CreateModuleEntity({
          id: module.id,
          system: module.system,
          module: module.module,
          status: module.status,
        })
    );
  }
  findById(id: number): Promise<CreateModuleEntity> {
    const res = this.prisma.module.findUnique({
      where: { id },
    });
    return res;
  }
  update(module: TModuleSchemaDto): Promise<CreateModuleEntity> {
    const value = ModuleSchemaDto.parse(module);
    const { module: moduleName } = value;
    try {
      const existingModule = this.prisma.module.findFirst({
        where: { module: moduleName },
      });
      if (!existingModule) {
        throw new Error("Modulo não encontrado!");
      }
      return this.prisma.module.update({
        where: { id: value.id },
        data: {
          module: value.module,
          system: value.system,
          status: value.status,
        },
      });
    } catch (error) {
      throw new Error("Erro ao atualizar modulo!");
    }
  }
  async delete(id: number): Promise<void> {
    try {
      const res = await this.prisma.module.findUnique({
        where: { id },
      });
      if (!res) {
        throw new Error("Modulo não encontrado!");
      }
      await this.prisma.module.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error("Erro ao deletar modulo!");
    }
  }
}
