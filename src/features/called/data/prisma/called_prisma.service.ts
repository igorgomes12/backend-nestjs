import type { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import { NotFoundException } from "@nestjs/common";
import {
  calledSchema,
  type CalledDto,
} from "features/called/domain/dto/called.dto";
import { CalledEntity } from "features/called/domain/entity/called.entity";
import { CalledMapper } from "features/called/domain/mappers/called.mappers";
import type { CalledTypeService } from "features/called/domain/services/called-type.service";

export class CalledPrismaService implements CalledTypeService {
  constructor(private readonly service: PrismaService) {}

  async findAll(params: Partial<CalledDto>): Promise<CalledEntity[]> {
    const where = Object.fromEntries(
      Object.entries(params).filter(([, value]) => value !== undefined)
    );

    const data = await this.service.called.findMany({
      where,
      orderBy: {
        id: "asc",
      },

      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        priority: true,
        type: true,
        contact: true,
        caller: true,
        system: true,
        module: true,
        requested: true,
        note: true,
        response: true,
        solutionType: true,
        duration: true,
        completedAt: true,
        timestampFinally: true,
        createdAt: true,
        timestamp: true,
        updatedAt: true,
        deletedAt: true,
      },
    });

    return data.map(
      (account) =>
        new CalledEntity({
          id: account.id,
          name: account.name,
          description: account.description,
          status: account.status,
          type: account.type,
          contact: account.contact,
          caller: account.caller,
          system: account.system,
          module: account.module,
          requested: account.requested,
          note: account.note,
          priority: account.priority,
          response: account.response,
          solutionType: account.solutionType,
          duration: account.duration,
          completedAt: account.completedAt,
          timestampFinally: account.timestampFinally,
          createdAt: account.createdAt,
          timestamp: account.timestamp,
          updatedAt: account.updatedAt,
          deletedAt: account.deletedAt,
        })
    );
  }

  // Outros métodos não implementados
  findById(id: number): Promise<CalledEntity | null> {
    return this._get(id);
  }
  async create(user: CalledDto): Promise<CalledEntity> {
    const parsedData = calledSchema.parse(user);
    const createdAccount = this.service.called.create({
      data: {
        priority: parsedData.priority,
        caller: parsedData.caller,
        name: parsedData.name,
        description: parsedData.description,
        status: parsedData.status,
        type: parsedData.type,
        contact: parsedData.contact,
        system: parsedData.system,
        module: parsedData.module,
        requested: parsedData.requested,
        note: parsedData.note,
        response: parsedData.response,
        solutionType: parsedData.solutionType,
        duration: parsedData.duration,
        completedAt: parsedData.completedAt,
        timestampFinally: parsedData.timestampFinally,
        createdAt: parsedData.createdAt,
        timestamp: parsedData.timestamp,
        updatedAt: parsedData.updatedAt,
        deletedAt: parsedData.deletedAt,
      },
    });

    if (!createdAccount) {
      throw new Error("Falha ao criar conta, não tem conta cadastrada");
    }
    return CalledMapper.toEntity(await createdAccount);
  }
  async update(id: number, user: Partial<CalledEntity>): Promise<CalledEntity> {
    await this._get(id);

    const updateData: Partial<CalledEntity> = {};
    if (typeof user.priority !== "undefined")
      updateData.priority = user.priority;
    if (typeof user.caller !== "undefined") updateData.caller = user.caller;
    if (typeof user.name !== "undefined") updateData.name = user.name;
    if (typeof user.description !== "undefined")
      updateData.description = user.description;
    if (typeof user.status !== "undefined") updateData.status = user.status;
    if (typeof user.type !== "undefined") updateData.type = user.type;
    if (typeof user.contact !== "undefined") updateData.contact = user.contact;
    if (typeof user.system !== "undefined") updateData.system = user.system;
    if (typeof user.module !== "undefined") updateData.module = user.module;
    if (typeof user.requested !== "undefined")
      updateData.requested = user.requested;
    if (typeof user.note !== "undefined") updateData.note = user.note;
    if (typeof user.response !== "undefined")
      updateData.response = user.response;
    if (typeof user.solutionType !== "undefined")
      updateData.solutionType = user.solutionType;
    if (typeof user.duration !== "undefined")
      updateData.duration = user.duration;
    if (typeof user.completedAt !== "undefined")
      updateData.completedAt = user.completedAt;
    if (typeof user.timestampFinally !== "undefined")
      updateData.timestampFinally = user.timestampFinally;
    if (typeof user.createdAt !== "undefined")
      updateData.createdAt = user.createdAt;
    if (typeof user.timestamp !== "undefined")
      updateData.timestamp = user.timestamp;
    if (typeof user.updatedAt !== "undefined")
      updateData.updatedAt = user.updatedAt;
    if (typeof user.deletedAt !== "undefined")
      updateData.deletedAt = user.deletedAt;

    return this.service.called.update({
      where: { id },
      data: updateData,
    });
  }
  async delete(id: number): Promise<void> {
    await this._get(id);
    await this.service.called.delete({
      where: {
        id,
      },
    });
  }
  findByName(name: string): Promise<CalledEntity | null> {
    return this.service.called.findFirst({
      where: {
        name,
      },
    });
  }

  protected async _get(id: number): Promise<CalledEntity> {
    try {
      const account = await this.service.called.findUnique({
        where: { id },
      });

      if (!account) {
        throw new NotFoundException("Conta não encontrada");
      }

      return CalledMapper.toEntity(account);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Erro ao buscar conta: ${error}`);
    }
  }
}
