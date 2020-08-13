import * as os from "os";
import * as path from "path";
import * as fs from "fs-extra";
import figlet from "figlet";
import open from "open";
import {
    createConnection, Connection, getManager, EntityManager
} from "typeorm";
import { AppArgs } from "./AppArgs";
import { AppConfig, AppConfigSerilizer } from "./AppConfig";
import {
    ActionController, HitokotoService, Controller, TargetController, StaticController, StatefulController, UserController
} from "./control";
import * as entities from "./entity";
import { MainMenuView } from "./view";
import { User } from "./entity";
import { AppMetadata } from "./AppMetadata";
import { registerPrompt } from "inquirer";
import AutocompletePrompt from "inquirer-autocomplete-prompt";
import DatepickerPrompt from "inquirer-datepicker-prompt";


/**
 * 应用程序核心
 *
 * 控制整个应用程序的起停。
 */
export class App {
    private static instance?: App

    private args: AppArgs;
    public debuggable: boolean
    private shouldStop = false;

    private programDir: string
    private configPath: string
    private mainDBPath: string
    private hitokotoDBPath: string

    private config: AppConfig
    private metadata: AppMetadata
    private mainDBConnection: Connection
    private hitokotoDBConnection: Connection

    private currentUser?: User

    private controllerMap: Map<typeof Controller, Controller>

    private constructor() {
        this.parseCommandArgs();
        this.setDebuggable();

        this.setPath();
        this.ensurePath();

        this.controllerMap = new Map();
    }

    public static getInstance(): App {
        if (!App.instance) {
            App.instance = new App();
        }
        return App.instance;
    }

    public getController(type: typeof Controller): Controller {
        const controller = this.controllerMap.get(type);
        if (!controller) {
            throw new TypeError(`${type} 未被初始化。`);
        }
        return controller;
    }

    public get version(): string {
        const packageJSON = fs.readFileSync(path.join(__dirname, "/../package.json"), { encoding: "utf8" });
        const packageInfo = JSON.parse(packageJSON);
        return packageInfo.version;
    }

    public getMainDBConnection(): Connection {
        return this.mainDBConnection;
    }

    public getHitokotoDBConnection(): Connection {
        return this.hitokotoDBConnection;
    }

    public getMainDBManager(): EntityManager {
        return getManager(this.getMainDBConnection().name);
    }

    public getHitokotoDBManager(): EntityManager {
        return getManager(this.getHitokotoDBConnection().name);
    }

    public getCurrentUser(): User {
        return this.currentUser;
    }

    private parseCommandArgs(): void {
        this.args = new AppArgs();
    }

    private setDebuggable(): void {
        this.debuggable = process.env.NODE_ENV === "development";
        if (this.args.hasFlag("d") || this.args.hasFlag("debug")) {
            this.debuggable = true;
        }
    }

    private setPath(): void {
        const platform = os.platform();
        const homeDir = os.homedir();

        this.programDir = "";
        switch (platform) {
            case "win32": {
                this.programDir = path.resolve(homeDir + "/AppData/Local/DayPrimer");
                break;
            }

            case "linux": case "darwin": {
                this.programDir = path.resolve(homeDir + "/.DayPrimer");
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
        await this.initMetadata();
        await this.initControllers();

        this.updateHitokoto();

        let shouldLaunchInteractiveUI = true;
        const getNextCommand = this.args.consumeComand.bind(this.args);
        for (let command = getNextCommand(); command != null; command = getNextCommand()) {
            if (command === "data") {
                open(this.programDir);
                shouldLaunchInteractiveUI = false;
            }
        }

        if (shouldLaunchInteractiveUI) {
            this.initCLI();

            try {
                this.launchInteractiveUI();
            } catch (err) {
                console.log(err);

                if (err.isTtyError) {
                    console.error("当前环境不是 TTY，交互模式需要在 TTY 环境下使用。");
                }
            }
        }
    }

    private async initConfig(): Promise<void> {
        this.config = await AppConfigSerilizer.load(this.configPath);
        AppConfigSerilizer.save(this.config, this.configPath);
    }

    private async initMetadata(): Promise<void> {
        this.metadata = await AppMetadata.load();
    }

    private async initDB(): Promise<void> {
        await createConnection({
            name:     "main",
            type:     "sqlite",
            database: this.mainDBPath,
            entities: [
                entities.TargetEntity,
                entities.TargetAttachment,
                entities.Action,
                entities.ActionAttachment,
                entities.User,
                entities.UserAuthInfo,
                entities.AppMetadataEntity
            ],
            logging:     this.debuggable,
            logger:      "advanced-console",
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
            logger:      "advanced-console",
            synchronize: true
        })
            .then(conn => this.hitokotoDBConnection = conn)
            .catch(err => console.error(err));
    }

    private async initControllers(): Promise<void> {
        const controllers = [
            ActionController,
            TargetController,
            UserController
        ];

        await Promise.all(controllers.map(async controller => {
            const instance = await this.initController(controller);
            this.controllerMap.set(controller, instance);
        }));
    }

    private async initController(type: typeof Controller): Promise<Controller> {
        if (type.prototype instanceof StaticController) {
            return new (type as typeof StaticController)(this);
        } else if (type.prototype instanceof StatefulController) {
            return new (type as typeof StatefulController)(this);
        }

        throw TypeError(`${type} 是不支持的控制器类型，无法被初始化。`);
    }

    private initCLI(): void {
        registerPrompt("autocomplete", AutocompletePrompt);
        registerPrompt("datetime", DatepickerPrompt);
    }

    private updateHitokoto(): void {
        if (this.config.updateHitokotoAtStartup) {
            HitokotoService.update();
        }
    }

    private async launchInteractiveUI(): Promise<void> {
        this.printTitle();
        await this.loginUser();
        await this.greeting();

        while (!this.shouldStop) {
            await new MainMenuView().invoke();
        }
    }

    private printTitle(): void {
        const textArt = (text: string): string => figlet.textSync(text, "Star Wars");
        console.log(textArt("DayP"));
    }

    public async loginUser(user?: User): Promise<void> {
        if (user) {
            this.currentUser = user;
        } else if (this.metadata.lastLoginUserId) {
            const db = this.getMainDBManager();
            const user = await db.findOne(User, { id: this.metadata.lastLoginUserId });
            if (user) {
                this.currentUser = user;
            }
        }

        if (this.currentUser) {
            await this.metadata.saveKey("lastLoginUserId", this.currentUser.id);
        }
    }

    public async logoutUser(): Promise<void> {
        this.currentUser = null;
        await this.metadata.saveKey("lastLoginUserId", null);
    }

    private async greeting(): Promise<void> {
        const hitokoto = await HitokotoService.random();
        if (hitokoto != null) {
            console.log(`［一言］${hitokoto.content} ——${hitokoto.from}`);
        }

        if (this.currentUser) {
            console.log(`欢迎回来，${this.currentUser.username}。`);
        } else {
            console.log("未登录。");
        }
    }

    public stop(code?: number): void {
        this.shouldStop = true;
        if (code) {
            process.exitCode = code;
        }
    }
}


export function getApp(): App {
    return App.getInstance();
}
