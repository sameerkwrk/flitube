import { play } from "./utils/player.js";
import { search } from "@inquirer/prompts";
// import { input, confirm } from "@inquirer/prompts"
import { select, Separator } from "@inquirer/prompts";
import yts from "yt-search";
import ytdl from "@distube/ytdl-core";
import colors from "ansi-colors";
import { queue } from "./utils/queue.js";

console.log(
  colors.cyan(`

                                                                           
    _/_/_/_/  _/        _/_/_/  _/_/_/_/_/  _/    _/  _/_/_/    _/_/_/_/   
   _/        _/          _/        _/      _/    _/  _/    _/  _/          
  _/_/_/    _/          _/        _/      _/    _/  _/_/_/    _/_/_/       
 _/        _/          _/        _/      _/    _/  _/    _/  _/            
_/        _/_/_/_/  _/_/_/      _/        _/_/    _/_/_/    _/_/_/_/       
                                                                           
                                                                           


`)
);

var state = true;

while (state) {
  const answer = await search({
    message: "Search for music/playlist",
    source: async (input, { signal }) => {
      if (!input) {
        return [];
      }
      const data = await yts(input);

      return data.videos.map((pkg, i) => ({
        name: `${i + 1}. ${colors.cyan(pkg.title)} ${colors.magenta(
          pkg.timestamp
        )}`,
        value: { url: pkg.url, duration: pkg.seconds },
        description: `${colors.bgMagentaBright(`By ${pkg.author.name}`)}`,
      }));
    },
  });

  queue.push(answer.url);
  const user_mood = await select({
    message: "Select a option to proceed",
    choices: [
      {
        name: "add",
        value: "add",
        description: "add music to the queue",
      },
      {
        name: "status",
        value: "status",
        description: "shows the player status",
      },
      new Separator(),
      {
        name: "exit",
        value: "exit",
        description: "exit the interface (player still keeps running)",
      },
      {
        name: "terminate",
        value: "terminate",
        description: "kills the speaker process (to stop music)",
      },
    ],
  });
  switch (user_mood) {
    case "exit":
      state = false;
      break;
    case "add":
      continue;
    case "status":
      console.log(colors.cyan(JSON.stringify(queue.getStats())));
      continue;
    case "terminate":
      process.exit();
  }
}
