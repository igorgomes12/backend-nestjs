import { Roles } from "@infra/middleware/decorator.rolues";
import { ZodValidationPipe } from "@infra/middleware/pipes/zod_validation_pipes";
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { AccoutingService } from "./accouting.service";
import { AccountingSchema, type TAccountingSchema } from "./dto/accounting_zod";
import { Response } from "express";
import { JwtAuthGuard } from "@infra/auth/guards/decorators/jwt_auth.decorator";
import { RolesGuard } from "@infra/middleware/roles_guard";

@Controller("accouting")
@UseGuards(JwtAuthGuard, RolesGuard)
export class AccoutingController {
  constructor(private readonly accoutingService: AccoutingService) {}

  @Post()
  @Roles(
    "ADMIN",
    "FINANCE",
    "REPRESENTATIVE",
    "REPRESENTATIVE_SUPERVISOR",
    "SUPPORT_SUPERVISOR",
    "PROGRAMMING_SUPERVISOR"
  )
  @UsePipes(new ZodValidationPipe(AccountingSchema))
  @HttpCode(HttpStatus.OK)
  create(@Body() data: TAccountingSchema) {
    return this.accoutingService.create(data);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles(
    "ADMIN",
    "FINANCE",
    "REPRESENTATIVE",
    "REPRESENTATIVE_SUPERVISOR",
    "SUPPORT_SUPERVISOR",
    "PROGRAMMING_SUPERVISOR"
  )
  findAll(
    @Query("id") id?: number,
    @Query("name") name?: string,
    @Query("contact") contact?: string,
    @Query("crc") crc?: string,
    @Query("cnpj") cnpj?: string,
    @Query("email") email?: string,
    @Query("phone") phone?: string
  ) {
    return this.accoutingService.filter({
      id,
      name,
      contact,
      crc,
      cnpj,
      email,
      phone,
    });
  }

  @Patch()
  @Roles(
    "ADMIN",
    "FINANCE",
    "REPRESENTATIVE",
    "REPRESENTATIVE_SUPERVISOR",
    "SUPPORT_SUPERVISOR",
    "PROGRAMMING_SUPERVISOR"
  )
  @UsePipes(new ZodValidationPipe(AccountingSchema))
  @HttpCode(HttpStatus.OK)
  update(@Query("id") id: number, @Body() data: TAccountingSchema) {
    if (isNaN(id)) throw new BadRequestException("ID está invalido");

    return this.accoutingService.update(id, data);
  }

  @Delete()
  @Roles(
    "ADMIN",
    "FINANCE",
    "REPRESENTATIVE",
    "REPRESENTATIVE_SUPERVISOR",
    "SUPPORT_SUPERVISOR",
    "PROGRAMMING_SUPERVISOR"
  )
  @UsePipes(new ZodValidationPipe(AccountingSchema))
  @HttpCode(HttpStatus.OK)
  async remove(@Query("id") id: number, @Res() res: Response) {
    try {
      await this.accoutingService.remove(id);
      res.status(HttpStatus.OK).json({ message: "Removido com sucesso" });
    } catch (error) {
      if (error === "P2025") {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: `O estabelecimento com ID ${id} já foi excluído.`,
        });
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: `Erro ao excluir o estabelecimento com ID ${id}.`,
      });
    }
  }
}