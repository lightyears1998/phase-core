import { getConnection } from "typeorm";
import request from "request-promise";
import { Hitokoto } from "../entity";


export class HitokotoService {
    public static async random(): Promise<Hitokoto> {
        const repo = getConnection().getRepository(Hitokoto);
        const hitokoto = await repo.createQueryBuilder().orderBy("RANDOM()").getOne();
        return hitokoto;
    }

    public static save(hitokoto: Hitokoto): void {
        const repo = getConnection().getRepository(Hitokoto);
        repo.save(hitokoto);
    }

    public static async update(): Promise<void> {
        Array(10).forEach(async () => {
            const hitokoto = this.loadFromHitokotoCN();
            if (hitokoto != null) {
                this.save(await hitokoto);
            }
        });
    }

    public static async clean(): Promise<void> {
        const limit = 1024;

        const repo = getConnection().getRepository(Hitokoto);
        const count = await repo.count();
        if (count > limit) {
            const random = await repo.createQueryBuilder().orderBy("RANDOM()").limit(count - limit).getMany();
            repo.remove(random);
        }
    }

    public static async loadFromHitokotoCN(): Promise<Hitokoto> {
        let hitokoto = null;

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
                console.log(err);
            });

        return hitokoto;
    }
}
