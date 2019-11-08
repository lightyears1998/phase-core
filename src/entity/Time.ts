import { Column } from "typeorm";

export class Time {
    @Column() start: Date
    @Column() end: Date
    @Column() span: Date
}
