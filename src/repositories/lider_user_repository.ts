import type { User } from "@prisma/client";

export abstract class LiderUserRepository {
  // POST
  abstract create(
    name_user: string,
    email_login_user: string,
    password_user: string,
    channel_user: number,
    profile_user: "administrador" | "usuario" | "vendedor" | "suporte",
    status_user: "ativo" | "inativo",
    company_user: "lider" | "Quality" | "",
  ): Promise<void>;

  // GET
  abstract findAll(): Promise<User[]>;

  // DELETE
  abstract delete(userId: number): Promise<void>;

  // EDIT
  abstract update(userId: number, updateData: Partial<User>): Promise<User>;

  // FIND BY EMAIL
  abstract findByEmail(email: string): Promise<User | null>;

  // FIND BY NAME
  abstract findByName(name: string): Promise<User | null>;
}
