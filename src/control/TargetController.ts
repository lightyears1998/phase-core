import { TargetEntity } from "../entity";
import { getApp } from "..";


export class TargetController {
    public async createTarget(): Promise<TargetEntity> {
        const db = getApp().getMainDBManager();

        // @TODO
        return null;
    }

    public async updateTarget(target: TargetEntity) {
        // @todo
    }
}
