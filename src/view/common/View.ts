/**
 * 与用户交互的视图组件
 */
export abstract class View {
    /**
     * 视图的名称
     */
    protected name?: string;

    /**
     * 在显示视图时显示给用户消息
     */
    protected message?: string;

    /**
     * 向用户显示该视图。
     */
    public abstract async invoke(): Promise<void>;
}
