import express from 'express';
import cors from 'cors';
import generatePDF from './pdfGenerator.mjs';

const app= express();
app.use(cors());
app.use(express.json());

app.get("/", async(req,res)=>{     
    let response = {
        statusCode: 200,
        'headers': {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*'
        },    
        body: JSON.stringify("Hello"),
      };
      res.send(response);
});

app.post('/generateResume', async (req, res) => {
    try {
      const resumeData = req.body;
      const pdfBuffer = await generatePDF(resumeData);
  
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=resume.pdf');
      res.send(pdfBuffer);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

app.listen(3000,()=>{
    console.log("Server Started at 3000");
});
