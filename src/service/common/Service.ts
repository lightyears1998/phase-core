/**
 * 服务的抽象基类
 */
export abstract class Service {
    public async abstract start(): Promise<void>;
    public async abstract stop(): Promise<void>;
}
