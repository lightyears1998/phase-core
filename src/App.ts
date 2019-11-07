import os from "os";
import path from "path";
import fs from "file-system";
import figlet from "figlet";
import { createConnection, Connection } from "typeorm";
import { AppConfig } from "./AppConfig";
import { HitokotoService } from "./control";
import * as entities from "./entity";


export class App {
    debuggable: boolean
    programDir: string
    configPath: string
    mainDBPath: string

    config: AppConfig
    mainDBConnection: Connection

    constructor() {
        this.setDebuggable();
        this.setPath();
        this.ensurePath();
    }

    public get version() {
        const packageJSON = fs.readFileSync(path.join(__dirname, "/../package.json"), { encoding: "utf8" });
        const packageInfo = JSON.parse(packageJSON);
        return packageInfo.version;
    }

    private setDebuggable(): void {
        this.debuggable = process.env.NODE_ENV === "development";
    }

    private setPath(): void {
        const platform = os.platform();
        const homeDir = os.homedir();

        switch (platform) {
            case "win32": {
                this.programDir = path.resolve(homeDir + "/AppData/Local/Phase");
                this.configPath = path.resolve(this.programDir + "/config.json");
                this.mainDBPath = path.resolve(this.programDir + "/db.sqlite3");
                break;
            }

            case "linux": {
                this.programDir = path.resolve(homeDir + "/.phase");
                this.configPath = path.resolve(this.programDir + "/config.json");
                this.mainDBPath = path.resolve(this.programDir + "/db.sqlite3");
                break;
            }

            default: {
                throw "不支持的平台：" + platform;
            }
        }
    }

    private ensurePath(): void {
        fs.mkdirSync(path.dirname(this.configPath));
        fs.mkdirSync(path.dirname(this.mainDBPath));
    }

    public async start(): Promise<void> {
        await this.initConfig();
        await this.initDB();

        if (this.config.updateHitokotoAtStartup) {
            HitokotoService.update();
        }

        this.printTitle();
        this.greeting();
    }

    private async initConfig(): Promise<void> {
        this.config = await AppConfig.load(this.configPath);
        AppConfig.save(this.config, this.configPath);
    }

    private async initDB(): Promise<void> {
        await createConnection({
            type:        "sqlite",
            database:    this.mainDBPath,
            entities:    Object.values(entities),
            logging:     this.debuggable,
            synchronize: true
        }).then(conn => this.mainDBConnection = conn)
            .catch(err => console.log(err));
    }

    private printTitle(): void {
        const textArt = (text): string => figlet.textSync(text, "Star Wars");
        console.log(textArt("Phase"));
    }

    private async greeting(): Promise<void> {
        const hitokoto = await HitokotoService.random();
        if (hitokoto != null) {
            console.log(`［一言］${hitokoto.content} ——${hitokoto.from}`);
        }
    }
}
