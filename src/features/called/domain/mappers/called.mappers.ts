import { NotAcceptableException } from "@nestjs/common";
import type { Called } from "@prisma/client";
import { CalledEntity } from "../entity/called.entity";

export class CalledMapper {
  static toEntity(model: Called): CalledEntity {
    try {
      return new CalledEntity({
        id: model.id,
        priority: model.priority,
        caller: model.caller,
        name: model.name,
        description: model.description,
        status: model.status,
        type: model.type,
        contact: model.contact,
        system: model.system,
        module: model.module,
        requested: model.requested,
        note: model.note,
        response: model.response,
        solutionType: model.solutionType,
        duration: model.duration,
        completedAt: model.completedAt,
        timestampFinally: model.timestampFinally,
        createdAt: model.createdAt,
        timestamp: model.timestamp,
        updatedAt: model.updatedAt,
        deletedAt: model.deletedAt,
      });
    } catch {
      throw new NotAcceptableException(`Erro ao converter para Entidade`);
    }
  }
}
