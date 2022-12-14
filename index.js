const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
const fs=require("fs")
const extractFrame = require('ffmpeg-extract-frame')
fs.rmSync("images", { recursive: true });
try{fs.mkdirSync('images')}catch(e){}
for (var i = 0; i < 100; i++) {
var n = "00000"+i.toString()
    var name = n.slice(-4)
    try {
        extractFrame({
            input: './import.mp4',
            output: `./images/${name}.png`,
            offset: 100 * [i] // seek offset in milliseconds
        }
        );
        console.log(`${name}.jpg was geberated!`)
    } catch (e) { break }
}