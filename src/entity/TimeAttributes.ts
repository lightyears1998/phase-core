import {Column} from "typeorm";

export abstract class TimeAttributes {
    @Column() startDate: Date
    @Column() endDate: Date
    @Column() length: Date
}
