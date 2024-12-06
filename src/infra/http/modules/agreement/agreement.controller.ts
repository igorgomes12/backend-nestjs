import { JwtAuthGuard } from "@infra/http/guards/decorators/jwt_auth.decorator";
import { Roles } from "@infra/http/middleware/decorator.rolues";
import { RolesGuard } from "@infra/http/middleware/roles_guard";
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Res,
  UseFilters,
  UseGuards,
} from "@nestjs/common";
import { AllExceptionsFilter } from "core/filters/exception.filter";
import { Response } from "express";
import type { AgreementDTO } from "features/agreement/domain/dto/agreement.dto";
import { CreateAgreementUseCase } from "features/agreement/domain/usecases/create-agreement.usecase";
import { DeleteAgreementUsecase } from "features/agreement/domain/usecases/delete-agreement.usecase";
import { FindAllAgreementUseCase } from "features/agreement/domain/usecases/find-all-agreement.usecase";
@Controller("agreement")
@Roles(
  "ADMIN",
  "FINANCE",
  "REPRESENTATIVE",
  "REPRESENTATIVE_SUPERVISOR",
  "SUPPORT_SUPERVISOR",
  "PROGRAMMING_SUPERVISOR"
)
@UseGuards(JwtAuthGuard, RolesGuard)
@UseFilters(AllExceptionsFilter)
export class AgreementeController {
  constructor(
    private readonly findAllAgreementUseCase: FindAllAgreementUseCase,
    private readonly deleteAgreementUsecase: DeleteAgreementUsecase,
    private readonly createAgreementUseCase: CreateAgreementUseCase
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Res() res: Response) {
    try {
      const agreement = await this.findAllAgreementUseCase.execute();
      return res.status(HttpStatus.OK).json(agreement);
    } catch (error) {
      return this.handleException(res, error, "Erro ao buscar contas");
    }
  }

  //   @Get(":id")
  //   async findById(@Res() res: Response, @Param("id", ParseIntPipe) id: number) {
  //     try {
  //       const agreement = await this.findAgreementByIdUseCase.execute(id);
  //       if (!agreement) {
  //         throw new NotFoundException("Agreement não encontrada");
  //       }
  //       return res.status(HttpStatus.OK).json(agreement);
  //     } catch (error) {
  //       return this.handleException(res, error, "Erro ao buscar agreement");
  //     }
  //   }

  //   @Put(":id")
  //   async update(
  //     @Res() res: Response,
  //     @Param("id", ParseIntPipe) id: number,
  //     @Body() updateData: any
  //   ) {
  //     try {
  //       await this.updateAgreementUseCase.execute(id, updateData);
  //       return res.status(HttpStatus.OK).json({
  //         status: HttpStatus.OK,
  //         message: "conta atualizado com sucesso",
  //       });
  //     } catch (error) {
  //       return this.handleException(res, error, "Erro ao atualizar Chamado");
  //     }
  //   }

  @Post()
  async create(@Res() res: Response, @Body() data: AgreementDTO) {
    try {
      await this.createAgreementUseCase.execute(data);
      return res.status(HttpStatus.CREATED).json({
        status: HttpStatus.CREATED,
        message: "conta criado com sucesso",
      });
    } catch (error) {
      return this.handleException(res, error, "Erro ao criar agreement");
    }
  }

  @Delete(":id")
  async remove(@Res() res: Response, @Param("id", ParseIntPipe) id: number) {
    try {
      await this.deleteAgreementUsecase.execute(id);
      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: "conta deletada com sucesso",
      });
    } catch (error) {
      return this.handleException(res, error, "Erro ao deletar conta");
    }
  }

  private handleException(
    res: Response,
    error: unknown,
    defaultMessage: string
  ) {
    if (
      error instanceof NotFoundException ||
      error instanceof BadRequestException
    ) {
      return res.status(error.getStatus()).json({ error: error.message });
    }
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: defaultMessage,
    });
  }
}
