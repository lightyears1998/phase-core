import os from "os";


export function checkOS(): void {
  switch (os.platform()) {
  case "win32":
    console.log("Happy win32");
    break;
  case "linux":
    console.log("Happy linux.");
    break;
  default:
    throw "Platform not supported.";
  }
}
