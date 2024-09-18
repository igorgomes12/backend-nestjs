import { PipeTransform, BadRequestException } from "@nestjs/common";
import { ZodError, ZodSchema } from "zod";

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      if (error instanceof ZodError) {
        // Personalize as mensagens de erro
        const detailedErrors = error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        }));

        throw new BadRequestException({
          message: "A validação falhou. Verifique os dados inseridos!",
          statusCode: 400,
          errors: detailedErrors,
        });
      }
      throw new BadRequestException("A validação falhou. Verifique os dados inseridos!!");
    }
  }
}