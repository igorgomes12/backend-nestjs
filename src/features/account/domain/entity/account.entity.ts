export class AccountEntity {
  id: number;
  value: string;
  description: string;
  observation?: string;
  status: boolean;
  bank: boolean;
  constructor(raw: AccountEntity) {
    Object.assign(this, raw);
  }
}
