import Queue from "better-queue";
import { play } from "./player.js";

export var queue = new Queue(play, {
  filo: true,
});
