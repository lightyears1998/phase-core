import { Column, Entity } from "typeorm";
import { BaseEntity } from "./BaseEntity";

@Entity()
export class Action extends BaseEntity {
    @Column() summary: string;
}
