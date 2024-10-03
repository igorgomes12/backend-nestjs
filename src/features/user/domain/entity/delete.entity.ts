export class DeleteUserEntity {
  public id: number;
  public name: string;
  public email: string;
  public password: string;
  public status: string;
  public channel: number;
  public organization: string | null;

  constructor(
    id: number,
    name: string,
    email: string,
    password: string,
    status: string,
    channel: number,
    organization: string | null
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.status = status;
    this.channel = channel;
    this.organization = organization;
  }
}
