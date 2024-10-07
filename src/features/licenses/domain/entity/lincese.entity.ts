export class Settings {
  public clienteSistema: boolean;
  public permiteEstoqueManual: boolean;
  public utilizaIntegraNovo: boolean;
  constructor(raw: Settings) {
    Object.assign(this, raw);
  }
}

export class LicenseEntity {
  public id: number;
  public contract_id: string;
  public system_id: string;
  public settings: Settings;
  public deleted_at: Date;
  public monthly_fee: number;
  constructor(raw: LicenseEntity) {
    Object.assign(this, raw);
  }
}
