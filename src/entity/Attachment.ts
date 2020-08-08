import { PrimaryGeneratedColumn, Column } from "typeorm";


export abstract class Attachment {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    public attchedTo: unknown;

    /**
     * 附件在文件系统中的路径
     */
    @Column()
    public filepath: string
}
