import { Service } from "./common"


/**
 * 持久化服务
 *
 * 为应用程序提供数据存储功能。
 */
export class PersistenceService extends Service {
    public start(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public stop(): Promise<void> {
        throw new Error("Method not implemented.");
    }

}
