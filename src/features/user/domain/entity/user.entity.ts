export class UserEntitiy {
  public name: string;
  public email: string;
  public profile: number;
  public status: string;

  constructor(name: string, email: string, profile: number, status: string) {
    this.name = name;
    this.email = email;
    this.profile = profile;
    this.status = status;
  }
}
