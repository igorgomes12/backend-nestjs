import {
  Logger,
  NotAcceptableException,
  type PipeTransform,
} from "@nestjs/common";

import type { ZodSchema } from "zod";

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  private logger = new Logger(ZodValidationPipe.name);
  transform(value: unknown) {
    const parsed = this.schema.safeParse(value);
    if (parsed.success === true) {
      return parsed.data;
    }

    this.logger.debug({
      value,
      error: parsed.error,
    });

    throw new NotAcceptableException({
      message:
        "Invalid input data. Please check the errors field for more details.",
      code: "validation_error",
      errors: parsed.error.flatten().fieldErrors,
    });
  }
}
