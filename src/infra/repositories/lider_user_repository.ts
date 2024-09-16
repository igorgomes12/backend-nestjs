import { PrismaClient, type User } from "@prisma/client";

export abstract class LiderUserRepository {
  protected prisma = new PrismaClient();
  abstract create(
    name: string,
    email: string,
    password: string,
    channel: number,
    profile: "admin"| "suport"| "sellers"| "user"| "user_basic"| "user_intermediate"| "user_premium",
    status: "ativo" | "inativo",
    company: "lider" | "Quality" | "",
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
