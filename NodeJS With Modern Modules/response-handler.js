// const fs = require("fs").promises;
import fs from "fs/promises";

import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const resHandler = (req, res, next) => {
  fs.readFile("my-page.html", "utf8")
    .then((data) => {
      res.send(data);
    })
    .catch(console.log);
  //   res.sendFile(path.join(__dirname, "my-page.html"));
};
