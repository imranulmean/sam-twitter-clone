import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer';

const app= express();
app.use(cors());
app.use(express.json());

app.get("/", async(req,res)=>{     

});

app.post('/generateResume', async (req, res) => {
      
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setContent(req.body);

      const pdfBuffer = await page.pdf();
      await browser.close();

      res.setHeader('Content-Type', 'application/pdf');
      // res.setHeader('Content-Disposition', 'attachment; filename=generated.pdf');
      res.send(pdfBuffer);
    });

app.listen(3000,()=>{
    console.log("Server Started at 3000");
});