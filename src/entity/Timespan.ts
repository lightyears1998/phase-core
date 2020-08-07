import { Column } from "typeorm";
import { RelationCountMetadata } from "typeorm/metadata/RelationCountMetadata";


/**
 * 时间段
 *
 * - 如果 `start`, `span` 和 `end`，无论三者是否矛盾，函数的返回值按 `start` 和 `span` 计算。
 */
export class Timespan {
    @Column() public start: Date
    @Column() public span: Date
    @Column() public end: Date

    public constructor(start?: Date, span?: Date) {
        this.start = start;
        this.span = span;
    }

    public setTimeStartAndSpan(start: Date, span: Date): void {
        this.start = start;
        this.span = span;
    }

    public setTimeStartAndEnd(start: Date, end: Date): void {
        this.start = start;
        this.span = new Date(end.getTime() - start.getTime());
    }
}
