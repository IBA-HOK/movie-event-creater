let generateFrames = require('gif-to-png')
const sharp = require("sharp");
let fs = require('fs')
let gifURL = './import.gif'
let outputPath = './images'
generateFrames(gifURL, outputPath)
    .then(urls => {
        // "urls" is an array containing the full path of each frame.
        console.log('Frames generated: ', urls);
        (async () => {
            var a =urls.toString()
            console.log(a)
            const imagePaths = urls
            const imageAttrs = [];
            console.log(imagePaths)
            // 連結する画像の情報取得
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
    
            // outputする画像の設定
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
    
            // 連結処理
            sharp({
                create: {
                    width: outputImgWidth,
                    height: outputImgHeight,
                    channels: 4,
                    background: { r: 255, g: 255, b: 255, alpha: 0 }
                }
            })
                .composite(compositeParams)
                .toFile("entername.png");
        })();
    

        const text=`
        spriteTypes = {
            frameAnimatedSpriteType = {
                name = "GFX_entername"
                texturefile = "gfx/path_to_file"
        	frameAnimatedSpriteType = {
            name = "GFX_news_SPR_Animated_Spanish_Civil_War"
            texturefile = "gfx/event_pictures/news_SPR_Animated_Spanish_Civil_War.png"
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
        fs.writeFileSync('./entername.txt', text)
        //file written successfully
        fs.rmdir(outputPath, { recursive: true });
      } catch (err) {
        console.error(err)
      }
    })
    .catch(error => {
        console.log("Uh oh, Something went wrong. \n", error)
    })

