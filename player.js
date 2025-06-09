import ytdl from "@distube/ytdl-core";
import Speaker from "speaker";
import ffmpeg from "fluent-ffmpeg";
import cliProgress from "cli-progress";
import colors from "ansi-colors";

const speaker = new Speaker({
  channels: 2, // 2 channels
  bitDepth: 16, // 16-bit samples
  sampleRate: 44100, // 44,100 Hz sample rate
});

const bar1 = new cliProgress.SingleBar(
  {
    format: "Player |" + colors.cyan("{bar}") + "| {percentage} % ",
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
    hideCursor: true,
  },
  cliProgress.Presets.shades_grey
);

function timeToSeconds(timeString) {
  const parts = timeString.split(":");
  const hours = parseInt(parts[0]) || 0;
  const minutes = parseInt(parts[1]) || 0;
  const seconds = parseFloat(parts[2]) || 0;

  return hours * 3600 + minutes * 60 + seconds;
}
export function play(url, duration) {
  ffmpeg()
    .input(
      ytdl(url, {
        filter: "audioonly",
        quality: "highestaudio",
        highWaterMark: 1 << 25,
      })
    )
    .audioCodec("pcm_s16le")
    .format("s16le") // Specify raw PCM format
    .audioFrequency(44100) // Set sample rate
    .audioChannels(2)
    .on("start", () => {
      bar1.start(100, 0);
    })
    .on("progress", (pg) => {
      bar1.update((timeToSeconds(pg.timemark) / duration) * 100 + 1);
    })
    .on("end", () => {
      bar1.stop();
    })
    .pipe(speaker);
}
