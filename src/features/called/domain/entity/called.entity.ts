import { $Enums } from "@prisma/client";

export class CalledEntity {
  id?: number;
  priority: $Enums.Priority;
  caller: string;
  name: string;
  description: string;
  status: boolean;
  type: $Enums.TypeCalled;
  contact: $Enums.TypeContact;
  system?: string | null;
  module?: string | null;
  requested: string;
  note?: string | null;
  response?: string | null;
  solutionType: $Enums.TypeSolutions;
  duration?: Date | null;
  completedAt?: Date | null;
  timestampFinally?: Date | null;
  createdAt?: Date | null;
  timestamp?: Date | null;
  updatedAt?: Date | null;
  deletedAt?: Date | null;

  constructor(data: Partial<Omit<CalledEntity, "constructor">>) {
    Object.assign(this, data);
  }
}
