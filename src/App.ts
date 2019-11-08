import os from "os";
import path from "path";
import fs from "fs-extra";
import figlet from "figlet";
import open from "open";
import { createConnection, Connection } from "typeorm";
import { AppArgs } from "./AppArgs";
import { AppConfig } from "./AppConfig";
import { HitokotoService } from "./control";
import * as entities from "./entity";


export class App {
    args: AppArgs;
    debuggable: boolean

    programDir: string
    configPath: string
    mainDBPath: string
    hitokotoDBPath: string

    config: AppConfig
    private mainDBConnection: Connection
    private hitokotoDBConnection: Connection

    constructor() {
        this.parseCommandArgs();
        this.setDebuggable();

        this.setPath();
        this.ensurePath();
    }

    public get version() {
        const packageJSON = fs.readFileSync(path.join(__dirname, "/../package.json"), { encoding: "utf8" });
        const packageInfo = JSON.parse(packageJSON);
        return packageInfo.version;
    }

    public getMainDBConnection() {
        return this.mainDBConnection;
    }

    public getHitokotoDBConnection() {
        return this.hitokotoDBConnection;
    }

    private parseCommandArgs() {
        this.args = new AppArgs();
    }

    private setDebuggable(): void {
        this.debuggable = process.env.NODE_ENV === "development";
        if (this.args.hasFlag("d") || this.args.hasFlag("debug")) { // -d, --debug
            this.debuggable = true;
        }
    }

    private setPath(): void {
        const platform = os.platform();
        const homeDir = os.homedir();

        this.programDir = "";
        switch (platform) {
            case "win32": {
                this.programDir = path.resolve(homeDir + "/AppData/Local/Phase");
                break;
            }

            case "linux": {
                this.programDir = path.resolve(homeDir + "/.phase");
                break;
            }
        }

        if (this.programDir === "") {
            throw "不支持的平台：" + platform;
        }

        this.configPath = path.resolve(this.programDir + "/config.json");
        this.mainDBPath = path.resolve(this.programDir + "/main.sqlite3");
        this.hitokotoDBPath = path.resolve(this.programDir + "/hitokoto.sqlite3");
    }

    private ensurePath(): void {
        fs.ensureDirSync(path.dirname(this.programDir));
        fs.ensureDirSync(path.dirname(this.configPath));
        fs.ensureDirSync(path.dirname(this.mainDBPath));
    }

    public async start(): Promise<void> {
        await this.initConfig();
        await this.initDB();

        this.updateHitokoto();

        let shouldLaunchUI = true;
        let command = this.args.consumeComand();
        while (command != null) {
            if (command === "data") {
                open(this.programDir);
                shouldLaunchUI = false;
            }
            command = this.args.consumeComand();
        }
        if (shouldLaunchUI) {
            this.launchUI();
        }
    }

    private async initConfig(): Promise<void> {
        this.config = await AppConfig.load(this.configPath);
        AppConfig.save(this.config, this.configPath);
    }

    private async initDB(): Promise<void> {
        await createConnection({
            name:     "main",
            type:     "sqlite",
            database: this.mainDBPath,
            entities: [
                entities.Target, entities.Action
            ],
            logging:     this.debuggable,
            synchronize: true
        })
            .then(conn => this.mainDBConnection = conn)
            .catch(err => console.log(err));

        await createConnection({
            name:        "hitokoto",
            type:        "sqlite",
            database:    this.hitokotoDBPath,
            entities:    [entities.Hitokoto],
            logging:     this.debuggable,
            synchronize: true
        })
            .then(conn => this.hitokotoDBConnection = conn)
            .catch(err => console.error(err));
    }


    private updateHitokoto() {
        if (this.config.updateHitokotoAtStartup) {
            HitokotoService.update();
        }
    }

    private async launchUI(): Promise<void> {
        this.printTitle();
        this.greeting();
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
