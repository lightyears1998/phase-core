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

  public static async loadFromHitokotoCN(): Promise<Hitokoto> {
    let hitokoto;

    await request("https://v1.hitokoto.cn/")
    .then(jsonString => {
      const json = JSON.parse(jsonString);
      hitokoto = new Hitokoto(
        Number(json.id),
        String(json.hitokoto),
        String(json.type),
        String(json.from),
        String(json.creator),
        new Date(parseInt(String(json.created_at)) * 1000)
      )
      console.log(hitokoto);
      getConnection().getRepository(Hitokoto).save(hitokoto);
    })
    .catch(err => {
      reject(err);
    })

    return hitokoto;
  }
  
  public static async random(): Promise<Hitokoto> {
    return Hitokoto.loadFromHitokotoCN();
  }
}
