import { writeFile, readFileSync } from "fs";

export class AppConfig {
    public updateHitokotoAtStartup: boolean;
}


export const defaultAppConfig = { updateHitokotoAtStartup: true } as AppConfig;



export class AppConfigSerilizer {
    public static async load(filepath: string): Promise<AppConfig> {
        const config = new AppConfig();

        let savedConfig: Record<string, number | string | boolean | undefined> = {};
        try {
            savedConfig = JSON.parse(readFileSync(filepath, { encoding: "utf8" }));
        } catch (err) {
            if (String(err.code) === "ENOENT") {
                console.log("未发现配置文件。");
            }
        }

        config.updateHitokotoAtStartup = Boolean(savedConfig.updateHitokotoAtStartup);

        return config;
    }

    public static async save(config: AppConfig, filepath: string): Promise<void> {
        writeFile(filepath, JSON.stringify(config, null, 2), (err) => {
            if (err) {
                console.log(err);
            }
        });
    }
}
