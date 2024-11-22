import * as dotenv from "dotenv";

dotenv.config();

export default class Config {
  private static _instance: Config | null = null;
  private readonly _databaseUrl: string;
  private readonly _mysqlBinPath: string;
  private readonly _backupDirectory: string;
  private readonly _pageSize: number;
  private readonly _poolSize: number;

  // Variables extraídas de la URL de la base de datos
  private readonly _user: string;
  private readonly _password: string;
  private readonly _host: string;
  private readonly _port: string;
  private readonly _database: string;

  private constructor() {
    // Cargar las variables de entorno
    this._databaseUrl = process.env.DATABASE_URL || "";
    this._mysqlBinPath = process.env.MYSQL_BINS_PATH || "";
    this._backupDirectory = process.env.BACKUP_DIRECTORY || "./backups";

    // Configuración de tamaños
    const pool = Number(process.env.POOL_SIZE);
    this._poolSize = isNaN(pool) ? 10 : pool;

    const page = Number(process.env.PAGE_SIZE);
    this._pageSize = isNaN(page) ? 10 : page;

    // Segmentación de la URL de la base de datos
    const dbUrl = new URL(this._databaseUrl);
    this._user = dbUrl.username;
    this._password = dbUrl.password;
    this._host = dbUrl.hostname;
    this._port = dbUrl.port || "3306"; // Si no hay puerto, usar 3306 por defecto
    this._database = dbUrl.pathname.substring(1); // Eliminar el primer '/' del pathname
  }

  public static get instance(): Config {
    if (Config._instance === null) Config._instance = new Config();
    return Config._instance;
  }

  // Métodos getter para acceder a las variables de entorno

  public get databaseUrl(): string {
    return this._databaseUrl;
  }

  public get mysqlBinPath(): string {
    return this._mysqlBinPath;
  }

  public get backupDirectory(): string {
    return this._backupDirectory;
  }

  public get pageSize(): number {
    return this._pageSize;
  }

  public get poolSize(): number {
    return this._poolSize;
  }

  // Métodos getter para acceder a los datos segmentados de la URL de la BD
  public get user(): string {
    return this._user;
  }

  public get password(): string {
    return this._password;
  }

  public get host(): string {
    return this._host;
  }

  public get port(): string {
    return this._port;
  }

  public get database(): string {
    return this._database;
  }
}
