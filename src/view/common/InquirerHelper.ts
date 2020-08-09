import { TargetEntity, Action } from "../../entity";
import Separator from "inquirer/lib/objects/separator";


export type InquirerChoiceItem = string | number | Separator | {
    name?: string,
    value?: unknown,
    short?: string
}


export class InquirerChoiceItemBuilder {
    public build(obejcts: Array<{name: string}>): InquirerChoiceItem[] {
        return obejcts.map(obj => {
            return {
                name:  obj.name,
                value: obj
            } as InquirerChoiceItem;
        });
    }

    public buildTargetListItem(targets: TargetEntity[]): InquirerChoiceItem[] {
        return this.build(targets);
    }

    public buildActionListItem(actions: Action[]): InquirerChoiceItem[] {
        return this.build(actions);
    }
}
