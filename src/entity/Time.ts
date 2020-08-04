import { Column } from "typeorm";


export class Time {
    @Column() start: Date
    @Column() span: Date

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

    public get end(): Date | null {
        if (this.start && this.span) {
            return new Date(this.start.getTime() + this.span.getTime());
        }
        return null;
    }
}
