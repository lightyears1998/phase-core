import { getConnection } from "typeorm";
import { Entity, PrimaryColumn, Column } from "typeorm";
import { app } from "./../";
import request from "request-promise";
import { reject } from "bluebird";

@Entity()
export class Hitokoto {
  @PrimaryColumn() id: number;
  @Column() content: string;
  @Column() type: string;
  @Column() from: string;
  @Column() creator: string;
  @Column() createdAt: Date;

  public constructor(id?, content?, type?, from?, creator?, createdAt?) {
    this.id = id;
    this.content = content;
    this.type = type;
    this.from = from;
    this.creator = creator;
    this.createdAt = createdAt;
  }
}
