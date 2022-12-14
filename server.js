
const sharp = require("sharp");
let fs = require('fs')
let gifURL = './import.gif'
let outputPath = './images'
const glob = require('glob');
var urls = []

try{fs.mkdirSync('output')}catch(e){}
const url = fs.readdirSync("./images");
for (let i = 0; i < url.length; i++) {
    urls.push("./images/" + url[i]);
    console.log(url[i])
}
(async () => {
    const imagePaths = urls
    const imageAttrs = [];
    console.log(imagePaths)
    const promises = [];
    const imagePromise = path =>
        new Promise(async resolve => {
            const image = await sharp(path);
            let width = 0,
                height = 0;
            await image
                .metadata()
                .then(meta => ([width, height] = [meta.width, meta.height]));
            const buf = await image.toBuffer();
            resolve({ width, height, buf });
        });
    imagePaths.forEach(path => promises.push(imagePromise(path)));
    await Promise.all(promises).then(values => {
        values.forEach(value => imageAttrs.push(value));
    });

    const outputImgWidth = imageAttrs.reduce((acc, cur) => acc + cur.width, 0);
    const outputImgHeight = Math.max(...imageAttrs.map(v => v.height));
    let totalLeft = 0;
    const compositeParams = imageAttrs.map(image => {
        const left = totalLeft;
        totalLeft += image.width;
        return {
            input: image.buf,
            gravity: "northwest",
            left: left,
            top: 0
        };
    });

    sharp({
        create: {
            width: outputImgWidth,
            height: outputImgHeight,
            channels: 4,
            background: { r: 255, g: 255, b: 255, alpha: 0 }
        }
    })
        .composite(compositeParams)
        .toFile("./output/output.png");
})();


const text = `
        spriteTypes = {
            frameAnimatedSpriteType = {
            name = "GFX_entername"
            texturefile = "gfx/path_to_file"
            noOfFrames = ${fs.readdirSync('./images').length}          
            loadType = "INGAME"
            allwaystransparent = no
            animation_rate_fps = 10
            looping = yes
            play_on_show = yes
            pause_on_loop = 0.0
        }
    }`
try {
    fs.writeFileSync('./output/output.txt', text)
    //file written successfully
} catch (err) {
    console.error(err)
}

