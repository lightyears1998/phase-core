import inquirer from "inquirer";


export interface NameAndDescriptionQuesionAnswer {
    name: string,
    description: string
}


export interface NameAndDescriptionQuestionOptions {
    name: string,
    message: string,
    default?: string
}


export class NameAndDescriptionQuestion implements inquirer.EditorQuestion {
    public name: string
    public type: "editor"
    public message: string
    public default?: string

    public filter(input: unknown): NameAndDescriptionQuesionAnswer {
        const nameAndDescription = String(input).trim().split("\n").filter(line => !line.startsWith("#"));
        const name = nameAndDescription[0] ?? "";
        const description = nameAndDescription.slice(1).join("\n").trim();
        return {
            name,
            description
        };
    }

    public constructor(option: NameAndDescriptionQuestionOptions) {
        this.name = option.name;
        this.type = "editor";
        this.message = option.message;
        this.default = option.default;
    }
}
