import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import { NotFoundException } from "@nestjs/common";
import { AgreementDTO } from "features/agreement/domain/dto/agreement.dto";
import { AgreementEntity } from "features/agreement/domain/entity/agreement.entity";
import { AgreementTypeService } from "features/agreement/domain/services/agreement-types.service";

export class AgreementService implements AgreementTypeService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(): Promise<AgreementEntity[]> {
    try {
      const agreements = await this.prisma.agreement.findMany({
        orderBy: {
          id: "asc",
        },
      });
      return agreements.map(
        (agreement) =>
          new AgreementEntity({
            id: agreement.id,
            timestamp: agreement.timestamp,
            representativeId: agreement.representativeId,
            description: agreement.description,
            value: agreement.value,
            clientId: agreement.clientId,
            paymment: agreement.paymment,
            paymentId: agreement.paymentId,
            observation: agreement.observation,
            situation: agreement.situation,
            situatonpayment: agreement.situatonpayment,
          })
      );
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      throw new Error("Não foi possível recuperar os dados de acordos.");
    }
  }
  findById(id: number): Promise<AgreementEntity | null> {
    return this._get(id);
  }
  async create(user: AgreementDTO): Promise<AgreementEntity> {
    try {
      const res = await this.prisma.agreement.create({
        data: {
          timestamp: user.timestamp,
          representativeId: user.representativeId,
          description: user.description,
          value: user.value,
          clientId: user.clientId,
          paymment: user.paymment,
          paymentId: user.paymentId,
          observation: user.observation,
          situation: user.situation,
          situatonpayment: user.situatonpayment,
        },
      });
      return new AgreementEntity({
        id: res.id,
        timestamp: res.timestamp,
        representativeId: res.representativeId,
        description: res.description,
        value: res.value,
        clientId: res.clientId,
        paymment: res.paymment,
        paymentId: res.paymentId,
        observation: res.observation,
        situation: res.situation,
        situatonpayment: res.situatonpayment,
      });
    } catch (error) {
      console.error("Erro ao criar acordos:", error);
      throw new Error("Não foi possível criar o acordos.");
    }
  }
  async update(
    id: number,
    user: Partial<AgreementEntity>
  ): Promise<AgreementEntity> {
    try {
      const existingAgreement = await this._get(id);
      const updatedData = {
        timestamp: user.timestamp || existingAgreement.timestamp,
        representativeId:
          user.representativeId || existingAgreement.representativeId,
        description: user.description || existingAgreement.description,
        value: user.value || existingAgreement.value,
        clientId: user.clientId || existingAgreement.clientId,
        paymment: user.paymment || existingAgreement.paymment,
        paymentId: user.paymentId || existingAgreement.paymentId,
        observation: user.observation || existingAgreement.observation,
        situation: user.situation || existingAgreement.situation,
        situatonpayment:
          user.situatonpayment || existingAgreement.situatonpayment,
      };
      const updatedAgreement = await this.prisma.agreement.update({
        where: { id },
        data: updatedData,
      });
      return new AgreementEntity({
        id: updatedAgreement.id,
        timestamp: updatedAgreement.timestamp,
        representativeId: updatedAgreement.representativeId,
        description: updatedAgreement.description,
        value: updatedAgreement.value,
        clientId: updatedAgreement.clientId,
        paymment: updatedAgreement.paymment,
        paymentId: updatedAgreement.paymentId,
        observation: updatedAgreement.observation,
        situation: updatedAgreement.situation,
        situatonpayment: updatedAgreement.situatonpayment,
      });
    } catch (error) {
      console.error("Erro ao atualizar acordo:", error);
      throw new Error("Não foi possível atualizar o acordo.");
    }
  }
  async delete(id: number): Promise<void> {
    try {
      await this._get(id);
      await this.prisma.agreement.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new Error("Erro ao buscar acordo: " + error);
    }
  }

  protected async _get(id: number): Promise<AgreementEntity | null> {
    try {
      const agreement = await this.prisma.agreement.findUnique({
        where: { id },
      });

      if (!agreement) {
        return null;
      }

      return new AgreementEntity({
        id: agreement.id,
        timestamp: agreement.timestamp,
        representativeId: agreement.representativeId,
        description: agreement.description,
        value: agreement.value,
        clientId: agreement.clientId,
        paymment: agreement.paymment,
        paymentId: agreement.paymentId,
        observation: agreement.observation,
        situation: agreement.situation,
        situatonpayment: agreement.situatonpayment,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Erro ao buscar conta: ${error}`);
    }
  }
}
