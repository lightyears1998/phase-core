import os from "os";
import path from "path";
import fs from "file-system";
import figlet from "figlet";
import { createConnection } from "typeorm";


export class App {
  debuggable: boolean
  configPath: string
  dbPath: string

  constructor() {
    this.setDebuggable();
    this.setPath();
    this.ensurePath();
    this.initConfig();
    this.initDB();
  }

  private setDebuggable(): void {

  }

  private setPath(): void {
    const platform = os.platform();
    const homeDir = os.homedir();

    switch (platform) {
        case "win32": {
          const projectRoot = path.resolve(homeDir + "/AppData/Local/Phase");
          this.configPath = path.resolve(projectRoot + "/config.json");
          this.dbPath = path.resolve(projectRoot + "/db.sqlite3");
          break;
        }

        case "linux": {
          const projectRoot = path.resolve(homeDir + "/.phase");
          this.configPath = path.resolve(projectRoot + "/config.json");
          this.dbPath = path.resolve(projectRoot + "/db.sqlite3");
          break;
        }

        default: {
          throw "不支持的平台：" + platform;
        }
    }
  }

  private ensurePath(): void {
    fs.mkdirSync(path.dirname(this.configPath));
    fs.mkdirSync(path.dirname(this.dbPath));
  }

  private initConfig(): void {

  }

  private initDB(): void {
    createConnection({
      type:     "sqlite",
      database: this.dbPath,
      logging:  true
    });
  }

  public start(): void {
    this.printTitle();
  }

  private printTitle(): void {
    const textArt = (text): string => figlet.textSync(text, "Star Wars");
    console.log(textArt("Phase"));
  }
}


class AppConfig {
  userName: string;

  static fromFile(filepath: string): AppConfig {
    const config = new AppConfig();
    return null;
  }
}
