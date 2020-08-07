import { TargetEntity, TargetProperties } from "../entity";
import { app } from "..";


export class TargetController {
    public async createTarget(): Promise<TargetEntity> {
        const db = app.getMainDBManager();

        // @TODO
        return null;
    }
}
