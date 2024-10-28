export default class Config {
  private static _instance: Config | null = null;
  private readonly _pageSize: number;
  private readonly _poolSize: number;

  private constructor() {
    const pool = Number(process.env.POOL_SIZE);
    this._poolSize = isNaN(pool) ? 10 : pool;
    const page = Number(process.env.PAGE_SIZE);
    this._pageSize = isNaN(page) ? 10 : page;
  }

  public static get instance(): Config {
    if (Config._instance === null) Config._instance = new Config();
    return Config._instance;
  }

  public get pageSize(): number {
    return this._pageSize;
  }

  public get poolSize(): number {
    return this._poolSize;
  }
}
