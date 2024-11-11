import type { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import { NotFoundException } from "@nestjs/common";
import {
  accountSchema,
  type TAccounts,
} from "features/account/domain/dto/account.dto";
import { AccountEntity } from "features/account/domain/entity/account.entity";
import type { AccountServiceMethods } from "features/account/domain/services/account.service";
import { AccountMapper } from "features/forms-payment/data/mappers/account.mapper";

export class AccountPrismaService implements AccountServiceMethods {
  constructor(private service: PrismaService) {}
  async findAll(params: TAccounts): Promise<AccountEntity[]> {
    const data = await this.service.account.findMany({
      where: {
        value: params.value,
        description: params.description,
        observation: params.observation,
        status: params.status,
        bank: params.bank,
      },
      orderBy: {
        id: "asc",
      },
      select: {
        id: true,
        value: true,
        description: true,
        observation: true,
        status: true,
        bank: true,
      },
    });

    return data.map(
      (account) =>
        new AccountEntity({
          id: account.id,
          value: account.value,
          description: account.description,
          observation: account.observation,
          status: account.status,
          bank: account.bank,
        })
    );
  }
  async update(id: number, params: Partial<TAccounts>): Promise<AccountEntity> {
    await this._get(id);

    const updateData: Partial<TAccounts> = {};
    if (typeof params.value !== "undefined") updateData.value = params.value;
    if (typeof params.description !== "undefined")
      updateData.description = params.description;
    if (typeof params.observation !== "undefined")
      updateData.observation = params.observation;
    if (typeof params.status !== "undefined") updateData.status = params.status;
    if (typeof params.bank !== "undefined") updateData.bank = params.bank;

    return this.service.account.update({
      where: { id },
      data: updateData,
    });
  }
  async remove(id: number): Promise<void> {
    await this._get(id);
    await this.service.account.delete({
      where: {
        id,
      },
    });
  }
  async create(params: TAccounts): Promise<AccountEntity> {
    try {
      const parsedData = accountSchema.parse(params);
      const createdAccount = this.service.account.create({
        data: {
          value: parsedData.value,
          description: parsedData.description,
          observation: parsedData.observation,
          status: parsedData.status,
          bank: parsedData.bank,
        },
      });

      if (!createdAccount) {
        throw new Error("Falha ao criar conta, não tem conta cadastrada");
      }
      return AccountMapper.toEntity(await createdAccount);
    } catch (error) {
      throw new Error("Falha ao criar conta: " + error);
    }
  }
  findByName(name: string): Promise<AccountEntity | null> {
    return this.service.account.findFirst({
      where: { description: name },
    });
  }
  findById(id: number): Promise<AccountEntity | null> {
    return this._get(id);
  }

  protected async _get(id: number): Promise<AccountEntity> {
    try {
      const account = await this.service.account.findUnique({
        where: { id },
      });

      if (!account) {
        throw new NotFoundException("Conta não encontrada");
      }

      return AccountMapper.toEntity(account);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Erro ao buscar conta: ${error}`);
    }
  }
}
