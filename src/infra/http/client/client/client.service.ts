// import { PrismaService } from "@infra/database/prisma/prisma.service";
// import {
//   ConflictException,
//   Injectable,
//   InternalServerErrorException,
// } from "@nestjs/common";
// import {
//   ClientSchema,
//  TClientFormData,
// } from "./entities/dtos/zod_validations";
// import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

// @Injectable()
// export class ClientService {
//   constructor(private prisma: PrismaService) {}

//   async createClient(data: TClientFormData) {
//     const parsedData = ClientSchema.parse(data);
//     try {
//       return this.prisma.client.create({
//         data: {
//           corporate: parsedData.corporate,
//           representative: parsedData.representative,
//           unit: parsedData.unit,
//           system: parsedData.system,
//           establishmentType: parsedData.establishmentType,
//           cpf_cnpj: parsedData.cpf_cnpj,
//           fantasy: parsedData.fantasy,
//           phone: parsedData.phone,
//           stateRegistration: parsedData.stateRegistration,
//           municipalRegistration: parsedData.municipalRegistration,
//           ruralRegistration: parsedData.ruralRegistration,
//           notes: parsedData.notes,
//           status: parsedData.status,
//           companyId: parsedData.companyId,
//           representativeId: parsedData.representativeId,
//           ownerId: parsedData.ownerId,
//           addressId: parsedData.addressId,
//           contactId: parsedData.contactId,
//           contabilityId: parsedData.contabilityId,
//           organizationId: parsedData.organizationId,
//         },
//       });
//     } catch (error) {
//       if (
//         error instanceof PrismaClientKnownRequestError &&
//         error.code === "P2002"
//       ) {
//         throw new ConflictException("O Cliente já está em uso.");
//       }
//       throw new InternalServerErrorException("Erro ao criar.");
//     }
//   }
// }
