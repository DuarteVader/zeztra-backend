import { log } from "console";
import { connect } from "mongoose";

import { ConsoleColors } from "../utils/ConsoleColors";
import { mongoURI } from "./config";

const start = () => {
  try {
    connect(String(mongoURI));

    log(ConsoleColors.Magenta, "Connected to MongoDB.");
  } catch {
    throw new Error("Failed trying to connect to MongoDB.");
  }
};

export { start };
