import { Entity } from "../entities_user/entity";

export type UserProps = {
  email: string;
  password: string;
};

export class UserEntity extends Entity<UserProps> {
  constructor(
    public readonly users: UserProps,
    id?: string
  ) {
    super(users, id);
    const { email, password } = users;

    if (!email || !password) {
      throw new Error("Invalid user data");
    }
    this.users = users;
  }

  update(value: string): void {
    this.email = value;
  }
  updatePassword(value: string): void {
    this.password = value;
  }

  get email(): string {
    return this.users.email;
  }

  private set email(value: string) {
    this.props.email = value;
  }

  get password(): string {
    return this.users.password;
  }

  private set password(value: string) {
    this.props.password = value;
  }
}
