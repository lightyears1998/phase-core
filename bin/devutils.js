#!/usr/bin/env node

"use strict";

const { remove } = require("fs-extra");
const { argv } = require("yargs");
const { resolve } = require("path");

const projectRoot = resolve(__dirname, "../");
const option = argv._.shift();


if (option === "clean") {
    remove(resolve(projectRoot, "./lib"));
    remove(resolve(projectRoot, "./var"));
    remove(resolve(projectRoot, "./ormlogs.log"));
    remove(resolve(projectRoot, "./yarn-error.log"));
} else {
    console.log("Do nothing.");
}
