export class CreateEntity {
  public name: string;
  public email: string;
  public password: string;
  public channel: number;
  public profile: string;
  public status: string;
  public organization: string;

  constructor(
    name: string,
    email: string,
    password: string,
    channel: number,
    profile: string,
    status: string,
    organization: string
  ) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.channel = channel;
    this.profile = profile;
    this.status = status;
    this.organization = organization;
  }
}
