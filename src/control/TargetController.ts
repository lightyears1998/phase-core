import {
    TargetEntity, User, TargetStatus, Timespan, Action
} from "../entity";
import { App } from "..";
import { StaticController } from "./common";
import { EntityManager, Not } from "typeorm";
import { getActionController } from ".";


export class TargetController extends StaticController {
    private db: EntityManager

    public constructor(app: App) {
        super(app);
        this.db = app.getMainDBManager();
    }

    public async listAllTargetsOfUser(user: User): Promise<TargetEntity[]> {
        return this.db.find(TargetEntity, {
            where: {
                owner: user,
                status: Not(TargetStatus.DELETED)
            }
        });
    }

    public async createTargetForUser(user: User, target: Partial<TargetEntity>): Promise<TargetEntity> {
        target.owner = user;
        target.status = target.status ?? TargetStatus.ACTIVE;
        target.timespan = target.timespan ?? new Timespan();
        return this.db.save(TargetEntity, target as TargetEntity);
    }

    public async updateTarget(target: TargetEntity): Promise<TargetEntity> {
        if (target.status === TargetStatus.DELETED) {
            await getActionController().deleteActionsOfTarget(target);
        }
        return this.db.save(TargetEntity, target);
    }
}
