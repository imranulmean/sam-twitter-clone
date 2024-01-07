import ffmpeg from 'fluent-ffmpeg';

const inputVideoPath = './video.mp4';
const outputTikTokPath = './outputTikTok.mp4';
const outputFacebookReelsPath = './outputFacebookReels.mp4';

// const resizeVideo = (inputPath, outputPath, width, height) => {
//     return new Promise((resolve, reject) => {
//       ffmpeg(inputPath).size(`${width}x${height}`).on('end', () => {
//           console.log(`Video resized successfully to ${width}x${height}.`);
//           resolve();
//         })
//         .on('error', (err) => {
//           console.error('Error resizing video:', err);
//           reject(err);
//         })
//         .on('progress',(progress)=>{
//           console.log(`Processing:${JSON.stringify(progress)} done`)
//         })
//         .save(outputPath);
//     });
//   };

const resizeVideo = (inputPath, outputPath, width, height, aspectRatio) => {
  return new Promise((resolve, reject) => {
    ffmpeg().input(inputPath).size(`${width}x${height}`)
    .aspect(aspectRatio)
    .on("end",()=>{
        console.log(`Videos converted to ${width}*${height}`);
        resolve();
    })
    .on('progress',(progress)=>{
      console.log(JSON.stringify(progress));
    })
    .on('error',(err)=>{
      console.log(err);
      reject(err);
    })
    .saveToFile(outputPath);
  });
};

// const tiktokPromise = await resizeVideo(inputVideoPath, outputTikTokPath, 100, 100, '9:16');
// const facebookReelsPromise = resizeVideo(inputVideoPath, outputFacebookReelsPath, 100, 100, '16:9');

export default resizeVideo;

// Promise.all([tiktokPromise, facebookReelsPromise]).then(() => {
//     console.log('All videos resized successfully.');
//   })
//   .catch((err) => {
//     console.error('Error:', err);
//   });
