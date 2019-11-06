import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

export abstract class BaseEntity {
    @PrimaryGeneratedColumn("uuid") id: string;
    @CreateDateColumn() createAt: Date;
    @UpdateDateColumn() updateAt: Date;
}
