import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer';
import multer from 'multer';
import fs from 'fs';
import resizeVideo from './videoTranscoder.mjs';

const app= express();
app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


app.get("/", async(req,res)=>{     

});

app.post('/upload', upload.single('video'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const videoBuffer = req.file.buffer;
    const videoPath = `./${Date.now()}_input.mp4`;
    fs.writeFileSync(videoPath, videoBuffer);
    console.log('Video saved:', videoPath);
    const outputTikTokPath = './outputTikTok.mp4';
    const outputFacebookReelsPath = './outputFacebookReels.mp4';
    const height=10;
    const width=10;
    const aspectRatio='9:16';
    // Call the function to generate videos for different platforms
    resizeVideo(videoPath, outputTikTokPath, height, width, aspectRatio);
    return res.json({ message: 'File uploaded successfully' });
  });

app.post('/generateResume', async (req, res) => {    
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      let pdfString="This is my first PDF \n and i am going to newyork";
      await page.setContent(pdfString);
      const pdfBuffer = await page.pdf();
      await browser.close();

      res.setHeader('Content-Type', 'application/pdf');
      // res.setHeader('Content-Disposition', 'attachment; filename=generated.pdf');
      res.send(pdfBuffer);
    });

app.listen(3000,()=>{
    console.log("Server Started at 3000");
});