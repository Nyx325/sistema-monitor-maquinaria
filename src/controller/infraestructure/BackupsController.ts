import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";
import Config from "../../config.js";
import UserError from "../../model/entities/UserError.js";
import { Request, Response } from "express";

export default class DatabaseBackup {
  private config: Config;
  private mysqlBinPath: string;
  private backupDirectory: string;

  constructor() {
    this.config = Config.instance;

    this.mysqlBinPath = this.config.mysqlBinPath || "";
    this.backupDirectory = this.config.backupDirectory;

    if (!fs.existsSync(this.backupDirectory)) {
      fs.mkdirSync(this.backupDirectory);
    }
  }

  protected handleError(e: unknown, res: Response) {
    if (e instanceof UserError) {
      res.status(400).json({ message: e.message });
    } else {
      console.error(e);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  private generateBackupFileName(): string {
    const date = new Date();

    // Formatear fecha y hora
    const dateString = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    const timeString = `${date.getHours().toString().padStart(2, "0")}-${date.getMinutes().toString().padStart(2, "0")}-${date.getSeconds().toString().padStart(2, "0")}`; // Usar "-" en lugar de ":"

    return path.join(
      this.backupDirectory,
      `backup_${this.config.database}_${dateString}_${timeString}.sql`,
    );
  }

  public createBackup(_req: Request, res: Response): void {
    try {
      const backupPath = this.generateBackupFileName();
      const mysqldumpCommand = `${this.mysqlBinPath ? this.mysqlBinPath + "/mysqldump" : "mysqldump"} --user=${this.config.user} --password=${this.config.password} --host=${this.config.host} --port=${this.config.port} --databases ${this.config.database} > ${backupPath}`;

      exec(mysqldumpCommand, (error, _stdout, stderr) => {
        if (error) {
          this.handleError(
            new Error(`Error ejecutando mysqldump: ${error.message}`),
            res,
          );
          return;
        }

        if (stderr) {
          // Verifica si el mensaje de stderr es una advertencia no crítica
          if (stderr.includes("Deprecated program name")) {
            console.warn(`WARNING: ${stderr}`);
          } else {
            this.handleError(new Error(`Error: ${stderr}`), res);
            return;
          }
        }

        res.status(200).json({ message: `Respaldo creado en: ${backupPath}` });
        console.log(`Respaldo creado en: ${backupPath}`);
      });
    } catch (e) {
      this.handleError(e, res);
    }
  }

  public restoreBackup(req: Request, res: Response): void {
    try {
      const { backup_name } = req.body;

      if (!backup_name) {
        this.handleError(
          new UserError("No se definió el nombre del respaldo a utilizar"),
          res,
        );
        return;
      }

      const backupFilePath = path.join(this.backupDirectory, backup_name);

      if (!fs.existsSync(backupFilePath)) {
        this.handleError(
          new UserError(`El archivo de respaldo no existe: ${backupFilePath}`),
          res,
        );
        return;
      }

      const restoreCommand = `${this.mysqlBinPath ? this.mysqlBinPath + "/mysql" : "mysql"} --user=${this.config.user} --password=${this.config.password} --host=${this.config.host} --port=${this.config.port} ${this.config.database} < ${backupFilePath}`;

      exec(restoreCommand, (error, _stdout, stderr) => {
        if (error) {
          this.handleError(
            new Error(`Error restaurando la base de datos: ${error.message}`),
            res,
          );
          return;
        }

        if (stderr) {
          // Verifica si el mensaje de stderr es una advertencia no crítica
          if (stderr.includes("Deprecated program name")) {
            console.warn(`WARNING: ${stderr}`);
          } else {
            this.handleError(new Error(`Error: ${stderr}`), res);
            return;
          }
        }

        res.status(200).json({
          message: `Restauración completada desde: ${backupFilePath}`,
        });
        console.log(`Restauración completada desde: ${backupFilePath}`);
      });
    } catch (e) {
      this.handleError(e, res);
    }
  }

  public getBackupFiles(req: Request, res: Response): void {
    try {
      const { pageNumber = "1" } = req.query;
      const page = parseInt(`${pageNumber}`, 10);

      if (!pageNumber || isNaN(page) || page <= 0) {
        this.handleError(
          new UserError("El número de página debe ser mayor o igual a 1"),
          res,
        );
        return;
      }

      if (!fs.existsSync(this.backupDirectory)) {
        fs.mkdirSync(this.backupDirectory, { recursive: true });
        console.log(`Directorio de respaldos creado: ${this.backupDirectory}`);
      }

      // Leer los archivos del directorio de respaldos
      const files = fs.readdirSync(this.backupDirectory);
      const backupFiles = files.filter((file) => file.endsWith(".sql"));

      const limit = this.config.pageSize;
      const totalFiles = backupFiles.length;
      const totalPages = Math.ceil(totalFiles / limit);
      const offset = (page - 1) * limit;
      const backups = backupFiles.slice(offset, offset + limit);

      res.status(200).json({
        page,
        totalPages: totalPages === 0 ? 1 : totalPages,
        backups: backups.reverse(),
      });
    } catch (e) {
      this.handleError(e, res);
    }
  }
}
