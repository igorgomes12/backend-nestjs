import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import { Injectable, NotFoundException } from "@nestjs/common";
import { TSchemaPayamentDtoForm } from "features/forms-payment/domain/dto/payment.dto";
import { PaymentEntity } from "features/forms-payment/domain/entity/payment.entity";
import { FormsPaymentService } from "features/forms-payment/domain/services/forms-payment.service";

@Injectable()
export class PaymentServicePrisma implements FormsPaymentService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(params: TSchemaPayamentDtoForm): Promise<PaymentEntity[]> {
    const payment = await this.prisma.paymentsType.findMany({
      where: {
        id: params.id,
        name: params.name,
      },

      orderBy: { id: "asc" },
    });

    return payment.map(
      (item) => new PaymentEntity({ id: item.id, name: item.name })
    );
  }
  async findById(id: number): Promise<PaymentEntity | null> {
    const payment = await this.prisma.paymentsType.findUnique({
      where: { id: id },
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    return new PaymentEntity({ id: payment.id, name: payment.name });
  }
  async create(user: TSchemaPayamentDtoForm): Promise<PaymentEntity> {
    const createPayment = await this.prisma.paymentsType.create({
      data: {
        name: user.name,
      },
    });
    return new PaymentEntity({
      id: createPayment.id,
      name: createPayment.name,
    });
  }
  async update(
    id: number,
    user: Partial<PaymentEntity>
  ): Promise<PaymentEntity> {
    const updatePayment = await this.prisma.paymentsType.update({
      where: { id },
      data: {
        name: user.name,
      },
    });

    return new PaymentEntity({
      id: updatePayment.id,
      name: updatePayment.name,
    });
  }
  async delete(id: number): Promise<void> {
    const deletePayment = await this.prisma.paymentsType.findUnique({
      where: { id },
    });

    if (!deletePayment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    await this.prisma.paymentsType.delete({
      where: { id },
    });
  }
  async findByName(name: string): Promise<PaymentEntity | null> {
    const paymentName = await this.prisma.paymentsType.findFirst({
      where: { name },
    });
    if (!paymentName) {
      return null;
    }
    return new PaymentEntity({
      id: paymentName.id,
      name: paymentName.name,
    });
  }
}
