import { getApp } from ".";
import { AppMetadataEntity } from "./entity";


/**
 * 应用程序的元数据
 *
 * 元数据是通过数据库持久化的。
 */
export class AppMetadata {
    public lastLoginUserId?: string

    public async save(): Promise<void> {
        const db = getApp().getMainDBManager();

        await Promise.all(Object.entries(this).map(async entry => {
            const key = entry[0], value = entry[1];
            await db.save(AppMetadataEntity, { key, value });
        }));
    }

    public async saveKey(key: string, value: string): Promise<void> {
        Object.defineProperty(this, key, {
            value, configurable: true, enumerable: true, writable: true
        });

        const db = getApp().getMainDBManager();
        await db.save(AppMetadataEntity, { key, value });
    }

    public static async load(): Promise<AppMetadata> {
        const db = getApp().getMainDBManager();
        const entries = await db.find(AppMetadataEntity);

        const metadata = new AppMetadata();
        entries.forEach(entry => {
            Object.defineProperty(metadata, entry.key, {
                value: entry.value, configurable: true, enumerable: true, writable: true
            });
        });

        return metadata;
    }

    public static async getKey(key: string): Promise<string> {
        const db = getApp().getMainDBManager();

        try {
            const entry = await db.findOneOrFail(AppMetadataEntity, { key });
            return entry.value;
        } catch {
            return null;
        }
    }
}
