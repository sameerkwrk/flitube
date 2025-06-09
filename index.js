import { play } from "./player.js";
import { search } from "@inquirer/prompts";
import yts from "yt-search";
import ytdl from "@distube/ytdl-core";
import colors from "ansi-colors";

console.log(
  colors.cyan(
    `
██╗   ██╗ ██████╗ ██╗   ██╗████████╗██╗   ██╗██████╗ ███████╗     ██████╗██╗     ██╗    ██████╗ ██╗      █████╗ ██╗   ██╗███████╗██████╗ 
╚██╗ ██╔╝██╔═══██╗██║   ██║╚══██╔══╝██║   ██║██╔══██╗██╔════╝    ██╔════╝██║     ██║    ██╔══██╗██║     ██╔══██╗╚██╗ ██╔╝██╔════╝██╔══██╗
 ╚████╔╝ ██║   ██║██║   ██║   ██║   ██║   ██║██████╔╝█████╗      ██║     ██║     ██║    ██████╔╝██║     ███████║ ╚████╔╝ █████╗  ██████╔╝
  ╚██╔╝  ██║   ██║██║   ██║   ██║   ██║   ██║██╔══██╗██╔══╝      ██║     ██║     ██║    ██╔═══╝ ██║     ██╔══██║  ╚██╔╝  ██╔══╝  ██╔══██╗
   ██║   ╚██████╔╝╚██████╔╝   ██║   ╚██████╔╝██████╔╝███████╗    ╚██████╗███████╗██║    ██║     ███████╗██║  ██║   ██║   ███████╗██║  ██║
   ╚═╝    ╚═════╝  ╚═════╝    ╚═╝    ╚═════╝ ╚═════╝ ╚══════╝     ╚═════╝╚══════╝╚═╝    ╚═╝     ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝
                                                                                                                                         
`
  )
);

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

play(answer.url, answer.duration);
