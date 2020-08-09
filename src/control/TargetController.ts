import {
    TargetEntity, User, TargetStatus, Timespan, Action
} from "../entity";
import { App } from "..";
import { StaticController } from "./common";
import { EntityManager } from "typeorm";


export class TargetController extends StaticController {
    private db: EntityManager

    public constructor(app: App) {
        super(app);
        this.db = app.getMainDBManager();
    }

    public async listAllTargetsOfUser(user: User): Promise<TargetEntity[]> {
        return this.db.find(TargetEntity, { owner: user });
    }

    public async createTargetForUser(user: User, target: Partial<TargetEntity>): Promise<TargetEntity> {
        target.owner = user;
        target.status = target.status ?? TargetStatus.ACTIVE;
        target.timespan = target.timespan ?? new Timespan();
        return this.db.save(TargetEntity, target as TargetEntity);
    }

    public async updateTargetOfUser(user: User, target: Partial<TargetEntity>): Promise<TargetEntity> {
        target.owner = user;
        return this.db.save(TargetEntity, target as TargetEntity);
    }

    public async loadActionsOfTarget(target: TargetEntity): Promise<TargetEntity> {
        if (!target.actions) {
            target.actions = await this.db.find(Action, { target });
        }
        return target;
    }
}
