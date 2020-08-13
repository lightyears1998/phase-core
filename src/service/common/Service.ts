/**
 * 服务的抽象基类
 *
 * 应用程序通常以单例模式存在。
 */
export abstract class Service {
    public async abstract start(): Promise<void>;
    public async abstract stop(): Promise<void>;
}
