export class UserEntitiy {
  public id: number;
  public name: string;
  public email: string;
  public profile: number;
  public status: string;

  constructor(
    name: string,
    email: string,
    profile: number,
    status: string,
    id: number
  ) {
    this.name = name;
    this.email = email;
    this.profile = profile;
    this.status = status;
    this.id = id;
  }
}
