export class UpdateserEntity {
  public id: number;
  public name: string;
  public email: string;
  public password: string;
  public status: string;

  constructor(
    id: number,
    name: string,
    email: string,
    password: string,
    status: string
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.status = status;
  }
}
