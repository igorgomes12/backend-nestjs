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
  Patch,
  Post,
  Query,
  Res,
  UseFilters,
  UseGuards,
} from "@nestjs/common";
import { AllExceptionsFilter } from "core/filters/exception.filter";
import { Response } from "express";
import { TSchemaPayamentDtoForm } from "features/forms-payment/domain/dto/payment.dto";
import { FormsPaymentService } from "features/forms-payment/domain/services/forms-payment.service";
import { CreatePaymentUseCase } from "features/forms-payment/domain/usecases/create.usecase";
import { DeletePaymentUseCase } from "features/forms-payment/domain/usecases/delete.usecase";
import { FindAllPaymentTypes } from "features/forms-payment/domain/usecases/find-all.usecase";
import { UpdatePaymentUsecase } from "features/forms-payment/domain/usecases/update.usecase";

@Controller("payment")
@UseFilters(AllExceptionsFilter)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
export class FormsPaymentController {
  constructor(
    private readonly findAllPaymentTypes: FindAllPaymentTypes,
    private readonly formsPaymentService: FormsPaymentService,
    private readonly createPaymentUseCase: CreatePaymentUseCase,
    private readonly deletePaymentUseCase: DeletePaymentUseCase,
    private readonly updatePaymentUsecase: UpdatePaymentUsecase
  ) {}

  @Post()
  async create(@Body() body: TSchemaPayamentDtoForm, @Res() res: Response) {
    try {
      const payment = await this.createPaymentUseCase.execute(body);
      return res.status(HttpStatus.CREATED).json({
        status: HttpStatus.CREATED,
        message: "Forma de pagamento criada com sucesso!",
        data: payment,
      });
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: TSchemaPayamentDtoForm) {
    return await this.findAllPaymentTypes.execute(query);
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  async findOne(@Param("id") id: string, @Res() res: Response) {
    try {
      const payment = await this.formsPaymentService.findById(+id);
      return res.status(HttpStatus.OK).json(payment);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  @Patch()
  async update(
    @Query("id") id: number,
    @Body() body: TSchemaPayamentDtoForm,
    @Res() res: Response
  ) {
    try {
      const updatedPayment = await this.updatePaymentUsecase.execute(id, body);
      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: "Forma de pagamento atualizada com sucesso!",
        data: updatedPayment,
      });
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  @Delete()
  async remove(@Query("id") id: number, @Res() res: Response) {
    try {
      await this.deletePaymentUseCase.execute(id);
      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: `O usuário com ID ${id} foi deletado com sucesso!`,
      });
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  private handleError(res: Response, error: any) {
    if (
      error instanceof NotFoundException ||
      error instanceof BadRequestException
    ) {
      return res.status(error.getStatus()).json({ error: error.message });
    }
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Erro interno do servidor" });
  }
}
