import { CalledEntity } from "../entity/called.entity";

export class CalledMapper {
  static toEntity(model: any): CalledEntity {
    return new CalledEntity({
      dadosGerais: {
        caller: model.caller,
        contact: model.contact,
        createdAt: model.createdAt.toISOString(),
        name: model.name,
        timestamp: model.timestamp.toISOString(),
      },
      centralAtendimento: {
        description: model.description,
        module: model.module,
        system: model.system,
        type: model.type,
      },
      descricao: {
        note: model.note || "",
        priority: model.priority,
        requested: model.requested,
        response: model.response || "",
        solutionType: model.solutionType,
      },
    });
  }
}
