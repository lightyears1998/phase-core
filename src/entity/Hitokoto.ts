import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Hitokoto {
  @PrimaryGeneratedColumn() id: number;
  @Column() content: string;
  @Column() type: string;
  @Column() from: string;
  @Column() creator: string;
  @Column() createdAt: Date;
}
