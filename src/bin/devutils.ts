import { remove } from "fs-extra";
import { argv } from "yargs";
import { resolve } from "path";


const projectRoot = resolve(__dirname, "../..");
const option = argv._.shift();


if (option === "clean") {
    remove(resolve(projectRoot, "./lib"));
    remove(resolve(projectRoot, "./var"));
    remove(resolve(projectRoot, "./ormlogs.log"));
    remove(resolve(projectRoot, "./yarn-error.log"));
} else {
    console.log("Do nothing.");
}
