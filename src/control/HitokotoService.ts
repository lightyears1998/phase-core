import { Hitokoto } from "../entity";
import { getConnection } from "typeorm";
import request from "request-promise";


export class HitokotoService {
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
        throw err;
      })

    return hitokoto;
  }

  public static async random(): Promise<Hitokoto> {
    return this.loadFromHitokotoCN();
  }

  public static save(hitokoto: Hitokoto): void {
    getConnection().getRepository(Hitokoto).save(hitokoto);
  }
}
