import {
  Logger,
  NotAcceptableException,
  type PipeTransform,
} from "@nestjs/common";
import type { ZodSchema } from "zod";
import { fromZodError } from "zod-validation-error";

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  private logger = new Logger(ZodValidationPipe.name);

  transform(value: unknown) {
    const parsed = this.schema.safeParse(value);
    if (parsed.success === true) {
      return parsed.data;
    }

    // Log the detailed error
    this.logger.debug({
      value,
      error: fromZodError(parsed.error),
    });

    // Extract detailed field errors
    const fieldErrors = parsed.error.flatten().fieldErrors;

    // Construct a detailed error response
    throw new NotAcceptableException({
      message:
        "Invalid input data. Please check the errors field for more details.",
      code: "validation_error",
      errors: fieldErrors,
    });
  }
}
