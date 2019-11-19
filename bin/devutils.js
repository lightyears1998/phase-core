#!/usr/bin/env node

const fs = require("fs-extra");
const yargs = require("yargs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "../");
const option = yargs.argv._.shift();


if (option === "clean") {
    fs.remove(path.resolve(projectRoot, "./lib"));
    fs.remove(path.resolve(projectRoot, "./var"));
    fs.remove(path.resolve(projectRoot, "./ormlogs.log"));
    fs.remove(path.resolve(projectRoot, "./yarn-error.log"));
} else {
    console.log("Do nothing.");
}
