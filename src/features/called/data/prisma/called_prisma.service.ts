import type { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import { NotFoundException } from "@nestjs/common";
import type { Priority, TypeCalled, TypeSolutions } from "@prisma/client";
import { type CalledDto } from "features/called/domain/dto/called.dto";
import { CalledEntity } from "features/called/domain/entity/called.entity";
import { CalledMapper } from "features/called/domain/mappers/called.mappers";
import { CalledTypeService } from "features/called/domain/services/called-type.service";

export class CalledPrismaService implements CalledTypeService {
  constructor(private readonly service: PrismaService) {}
  async findAll(): Promise<CalledEntity[]> {
    try {
      const res = await this.service.called.findMany({
        orderBy: {
          id: "asc",
        },
      });

      return res.map(
        (called) =>
          new CalledEntity({
            id: called.id,
            dadosGerais: {
              caller: called.caller,
              contact: called.contact,
              createdAt: called.createdAt?.toISOString() || "",
              name: called.name,
              timestamp: called.timestamp?.toISOString() || "",
            },
            centralAtendimento: {
              description: called.description,
              module: called.module,
              system: called.system,
              type: called.type,
            },
            descricao: {
              note: called.note,
              priority: called.priority,
              requested: called.requested,
              response: called.response,
              solutionType: called.solutionType,
            },
          })
      );
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      throw new Error("Não foi possível recuperar os dados de chamados.");
    }
  }
  async findById(id: number): Promise<CalledEntity | null> {
    return this._get(id);
  }
  async create(user: CalledDto): Promise<CalledEntity> {
    try {
      const contact = user.dadosGerais.contact;

      const typeCalled =
        user.centralAtendimento.type.toUpperCase() as TypeCalled;
      const priority = user.descricao.priority.toUpperCase() as Priority;
      const solutionType =
        user.descricao.solutionType.toUpperCase() as TypeSolutions;

      const createdAt = new Date(
        `${user.dadosGerais.createdAt}T${user.dadosGerais.timestamp}`
      );

      const res = await this.service.called.create({
        data: {
          caller: user.dadosGerais.caller,
          contact: contact,
          createdAt: createdAt,
          name: user.dadosGerais.name,
          timestamp: createdAt,
          description: user.centralAtendimento.description,
          module: user.centralAtendimento.module,
          system: user.centralAtendimento.system,
          type: typeCalled,
          note: user.descricao.note,
          priority: priority,
          requested: user.descricao.requested,
          response: user.descricao.response,
          solutionType: solutionType,
          status: true,
        },
      });

      return new CalledEntity({
        id: res.id,
        dadosGerais: {
          caller: res.caller,
          contact: res.contact,
          createdAt: res.createdAt.toISOString(),
          name: res.name,
          timestamp: res.timestamp.toISOString(),
        },
        centralAtendimento: {
          description: res.description,
          module: res.module,
          system: res.system,
          type: res.type,
        },
        descricao: {
          note: res.note,
          priority: res.priority,
          requested: res.requested,
          response: res.response,
          solutionType: res.solutionType,
        },
      });
    } catch (error) {
      console.error("Erro ao criar chamado:", error);
      throw new Error("Não foi possível criar o chamado.");
    }
  }

  async update(id: number, user: Partial<CalledEntity>): Promise<CalledEntity> {
    try {
      const existingCalled = await this._get(id);

      const updatedData = {
        dadosGerais: {
          caller: user.dadosGerais?.caller || existingCalled.dadosGerais.caller,
          contact:
            user.dadosGerais?.contact || existingCalled.dadosGerais.contact,
          createdAt:
            user.dadosGerais?.createdAt || existingCalled.dadosGerais.createdAt,
          name: user.dadosGerais?.name || existingCalled.dadosGerais.name,
          timestamp:
            user.dadosGerais?.timestamp || existingCalled.dadosGerais.timestamp,
        },
        centralAtendimento: {
          description:
            user.centralAtendimento?.description ||
            existingCalled.centralAtendimento.description,
          module:
            user.centralAtendimento?.module ||
            existingCalled.centralAtendimento.module,
          system:
            user.centralAtendimento?.system ||
            existingCalled.centralAtendimento.system,
          type:
            user.centralAtendimento?.type ||
            existingCalled.centralAtendimento.type,
        },
        descricao: {
          note:
            user.descricao?.note !== undefined
              ? user.descricao.note
              : existingCalled.descricao.note,
          priority:
            user.descricao?.priority || existingCalled.descricao.priority,
          requested:
            user.descricao?.requested || existingCalled.descricao.requested,
          response:
            user.descricao?.response !== undefined
              ? user.descricao.response
              : existingCalled.descricao.response,
          solutionType:
            user.descricao?.solutionType ||
            existingCalled.descricao.solutionType,
        },
      };

      const updatedCalled = await this.service.called.update({
        where: { id },
        data: updatedData,
      });

      return new CalledEntity({
        id: updatedCalled.id,
        dadosGerais: {
          caller: updatedCalled.caller,
          contact: updatedCalled.contact,
          createdAt: updatedCalled.createdAt?.toISOString() || "",
          name: updatedCalled.name,
          timestamp: updatedCalled.timestamp?.toISOString() || "",
        },
        centralAtendimento: {
          description: updatedCalled.description,
          module: updatedCalled.module,
          system: updatedCalled.system,
          type: updatedCalled.type,
        },
        descricao: {
          note: updatedCalled.note,
          priority: updatedCalled.priority,
          requested: updatedCalled.requested,
          response: updatedCalled.response,
          solutionType: updatedCalled.solutionType,
        },
      });
    } catch (error) {
      console.error("Erro ao atualizar chamado:", error);
      throw new Error("Não foi possível atualizar o chamado.");
    }
  }
  async delete(id: number): Promise<void> {
    try {
      await this._get(id);
      await this.service.called.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new Error("Erro ao buscar chamado: " + error);
    }
  }

  async findByName(name: string): Promise<CalledEntity | null> {
    const called = await this.service.called.findFirst({
      where: { name },
    });

    if (!called) {
      return null;
    }

    return CalledMapper.toEntity(called);
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
