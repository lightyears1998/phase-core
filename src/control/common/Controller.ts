import { App } from "../..";


export abstract class Controller {
    protected app: App;

    public constructor(app: App) {
        this.app = app;
    }
}


export class StaticController extends Controller {}


export class StatefulController extends Controller {
    public async start(): Promise<boolean> {
        return true;
    }

    public async stop(): Promise<void> {
        return;
    }
}
