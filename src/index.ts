import "reflect-metadata";
import { App } from "./App";

console.log(process.env.NODE_ENV);

const app = new App();
app.start();

export {
  app
};
