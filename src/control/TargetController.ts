import { TargetEntity } from "../entity";
import { app } from "..";


export class TargetController {
    public async createTarget(): Promise<TargetEntity> {
        const db = app.getMainDBManager();

        // @TODO
        return null;
    }

    public async updateTarget(target: TargetEntity) {
        // @todo
    }
}
