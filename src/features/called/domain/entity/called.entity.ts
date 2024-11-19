export class CalledEntity {
  id: number;
  dadosGerais: {
    caller: string;
    contact: string;
    createdAt: string;
    name: string;
    timestamp: string;
  };
  centralAtendimento: {
    description: string;
    module: string;
    system: string;
    type: string;
  };
  descricao: {
    note: string;
    priority: string;
    requested: string;
    response: string;
    solutionType: string;
  };

  constructor(data: Partial<CalledEntity>) {
    this.id = data.id || 0;
    this.dadosGerais = {
      caller: data.dadosGerais?.caller || "",
      contact: data.dadosGerais?.contact || "",
      createdAt: data.dadosGerais?.createdAt || new Date().toISOString(),
      name: data.dadosGerais?.name || "",
      timestamp: data.dadosGerais?.timestamp || new Date().toISOString(),
    };
    this.centralAtendimento = {
      description: data.centralAtendimento?.description || "",
      module: data.centralAtendimento?.module || "",
      system: data.centralAtendimento?.system || "",
      type: data.centralAtendimento?.type || "BUG",
    };
    this.descricao = {
      note: data.descricao?.note || "",
      priority: data.descricao?.priority || "LOW",
      requested: data.descricao?.requested || "",
      response: data.descricao?.response || "",
      solutionType: data.descricao?.solutionType || "PHONE",
    };
  }
}
