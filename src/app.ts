import os from "os";
import { checkOS } from "./util";

checkOS();

console.log(os.platform());

console.log("Hello, world!");
