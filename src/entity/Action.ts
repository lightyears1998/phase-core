import { Column, Entity } from "typeorm";
import { BasicAttributes } from "./BasicAttributes";

export enum ActionStatus {
    ESTABLISHED = "established"
}

@Entity()
export class Action  {
    @Column() summary: string;
}
