import { PipeTransform, BadRequestException } from "@nestjs/common";
import { fromZodError } from "zod-validation-error";
import { ZodError, ZodSchema } from "zod";

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: "A validação falhou!",
          statusCode: 400,
          errors: fromZodError(error),
        });
      }
      throw new BadRequestException("A validação falhou!");
    }
  }
}
