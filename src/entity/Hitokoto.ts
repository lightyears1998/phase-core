import {
    Entity, PrimaryColumn, Column
} from "typeorm";

@Entity()
export class Hitokoto {
    @PrimaryColumn() id: number;
    @Column() content: string;
    @Column() type: string;
    @Column() from: string;
    @Column() creator: string;
    @Column() createdAt: Date;

    public constructor(id?: number, content?: string, type?: string, from?: string, creator?: string, createdAt?: Date) {
        this.id = id;
        this.content = content;
        this.type = type;
        this.from = from;
        this.creator = creator;
        this.createdAt = createdAt;
    }
}
