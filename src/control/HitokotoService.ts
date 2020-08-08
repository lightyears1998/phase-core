import request from "request-promise";
import { Hitokoto } from "../entity";
import { getApp, App } from "../";
import { Controller } from "./common";


export class HitokotoService extends Controller {
    public constructor(app: App) {
        super(app);
    }

    public static async random(): Promise<Hitokoto> {
        const repo = getApp().getHitokotoDBConnection().getRepository(Hitokoto);
        const hitokoto = await repo.createQueryBuilder().orderBy("RANDOM()").getOne();
        return hitokoto;
    }

    public static save(hitokoto: Hitokoto): void {
        if (hitokoto != null) {
            const repo = getApp().getHitokotoDBConnection().getRepository(Hitokoto);
            repo.save(hitokoto);
        }
    }

    public static async update(): Promise<void> {
        [... Array(10).keys()].forEach(async () => {
            const hitokoto = await this.loadFromHitokotoCN();
            if (hitokoto != null) {
                this.save(hitokoto);
            }
        });

        this.removeRandomHitokotos();
    }

    public static async removeRandomHitokotos(): Promise<void> {
        const limit = 1024;

        const repo = getApp().getHitokotoDBConnection().getRepository(Hitokoto);
        const count = await repo.count();
        if (count > limit) {
            const random = await repo.createQueryBuilder().orderBy("RANDOM()").limit(count - limit).getMany();
            repo.remove(random);
        }
    }

    public static async loadFromHitokotoCN(): Promise<Hitokoto> {
        let hitokoto = null;

        await request("https://v1.hitokoto.cn/?c=a")
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
                if (getApp().debuggable) {
                    console.log(err);
                }
            });

        return hitokoto;
    }
}
