import { View } from "./common";
import marked from "marked";
import MarkedTerminalRender from "marked-terminal";


export class AboutView extends View {
    public introduction = `# Day Primer

Goal-driven action assistance software.

\`code\` with ♥ by *Day Primer* developers.`

    public async invoke(): Promise<void> {
        console.log(marked(this.introduction, { renderer: new MarkedTerminalRender() }));
    }
}
