import { BadRequestException, type PipeTransform } from "@nestjs/common";
import type { ZodSchema } from "zod";

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}
  transform(value: unknown) {
    const parsed = this.schema.safeParse(value);
    if (parsed.success) return parsed.data;

    throw new BadRequestException(parsed.error.format());
  }
}
