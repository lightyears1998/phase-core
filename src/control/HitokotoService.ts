import { getConnection } from "typeorm";
import request from "request-promise";
import { Hitokoto } from "../entity";


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
        );
      })
      .catch(err => {
        throw err;
      });

    return hitokoto;
  }

  public static async random(): Promise<Hitokoto> {
    const repo = getConnection().getRepository(Hitokoto);
    const count = await repo.count();
    const hitokoto = await repo.find({ take: 1, skip: Math.floor(Math.random() * count) });
    return hitokoto.length > 0 ? hitokoto[0] : null;
  }

  public static save(hitokoto: Hitokoto): void {
    const repo = getConnection().getRepository(Hitokoto);
    repo.save(hitokoto);
  }
}
