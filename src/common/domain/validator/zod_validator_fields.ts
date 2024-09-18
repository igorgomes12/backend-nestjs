import { z, ZodError, ZodSchema } from "zod";
import {
  FieldsErrors,
  ValidatorFieldsInterface,
} from "./validator_fields.interface";

export const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
});
export type TAuthenticateBodyForm = z.infer<typeof authenticateBodySchema>;

export abstract class ZodValidatorFields<PropsValidated>
  implements ValidatorFieldsInterface<PropsValidated>
{
  errors: FieldsErrors = null;
  validatedData: PropsValidated = null;

  constructor(private schema: ZodSchema<PropsValidated>) {}

  validate(data: any): boolean {
    try {
      this.validatedData = this.schema.parse(data);
      this.errors = null;
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        this.errors = this.formatErrors(error);
      }
      return false;
    }
  }

  private formatErrors(error: ZodError): FieldsErrors {
    const formattedErrors: FieldsErrors = {};
    error.errors.forEach((err) => {
      const path = err.path.join(".");
      if (!formattedErrors[path]) {
        formattedErrors[path] = [];
      }
      formattedErrors[path].push(err.message);
    });
    return formattedErrors;
  }
}
