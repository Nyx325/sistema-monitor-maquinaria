import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";
import Config from "../../config.js";
import UserError from "../../model/entities/UserError.js";

export default class DatabaseBackup {
  private config: Config;
  private mysqlBinPath: string;
  private backupDirectory: string;

  constructor() {
    this.config = Config.instance; // Obtener la instancia única de Config

    // Obtener los valores de la configuración de la base de datos desde Config
    this.mysqlBinPath = this.config.mysqlBinPath || "";
    this.backupDirectory = this.config.backupDirectory;

    // Crear el directorio de respaldos si no existe
    if (!fs.existsSync(this.backupDirectory)) {
      fs.mkdirSync(this.backupDirectory);
    }
  }

  // Método para generar un nombre de archivo único basado en la fecha
  private generateBackupFileName(): string {
    const date = new Date();
    const dateString = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}_${date.getHours().toString().padStart(2, "0")}${date.getMinutes().toString().padStart(2, "0")}`;
    return path.join(
      this.backupDirectory,
      `backup_${this.config.database}_${dateString}.sql`,
    );
  }

  // Método para realizar un volcado de la base de datos (crear un respaldo)
  public createBackup(): Promise<void> {
    const backupPath = this.generateBackupFileName();
    const mysqldumpCommand = `${this.mysqlBinPath ? this.mysqlBinPath + "/mysqldump" : "mysqldump"} --user=${this.config.user} --password=${this.config.password} --host=${this.config.host} --port=${this.config.port} --databases ${this.config.database} > ${backupPath}`;

    return new Promise((resolve, reject) => {
      exec(mysqldumpCommand, (error, stdout, stderr) => {
        if (error) {
          reject(new Error(`Error ejecutando mysqldump: ${error.message}`)); // Error del sistema
          return;
        }
        if (stderr) {
          reject(new Error(`Error: ${stderr}`)); // Error del sistema
          return;
        }
        console.log(`Respaldo creado en: ${backupPath}`);
        resolve();
      });
    });
  }

  // Método para restaurar la base de datos desde un respaldo
  public restoreBackup(backupFileName: string): Promise<void> {
    const backupFilePath = path.join(this.backupDirectory, backupFileName);

    // Verificar si el archivo de respaldo existe
    if (!fs.existsSync(backupFilePath)) {
      throw new UserError(
        `El archivo de respaldo no existe: ${backupFilePath}`,
      ); // Error del usuario
    }

    const restoreCommand = `${this.mysqlBinPath ? this.mysqlBinPath + "/mysql" : "mysql"} --user=${this.config.user} --password=${this.config.password} --host=${this.config.host} --port=${this.config.port} ${this.config.database} < ${backupFilePath}`;

    return new Promise((resolve, reject) => {
      exec(restoreCommand, (error, stdout, stderr) => {
        if (error) {
          reject(
            new Error(`Error restaurando la base de datos: ${error.message}`),
          ); // Error del sistema
          return;
        }
        if (stderr) {
          reject(new Error(`Error: ${stderr}`)); // Error del sistema
          return;
        }
        console.log(`Restauración completada desde: ${backupFilePath}`);
        resolve();
      });
    });
  }

  // Método para obtener los archivos de respaldo con paginación
  public getBackupFiles(page: number): {
    page: number;
    totalPages: number;
    backups: string[];
  } {
    const files = fs.readdirSync(this.backupDirectory);

    // Filtrar solo los archivos .sql
    const backupFiles = files.filter((file) => file.endsWith(".sql"));

    // Obtener el valor de limit desde Config (variables de entorno)
    const limit = this.config.pageSize; // Usar pageSize como el límite de la página

    // Calcular total de páginas
    const totalFiles = backupFiles.length;
    const totalPages = Math.ceil(totalFiles / limit); // Redondear hacia arriba para obtener el total de páginas

    // Aplicar paginación
    const offset = (page - 1) * limit;
    const backups = backupFiles.slice(offset, offset + limit);

    return { page, totalPages, backups };
  }
}
