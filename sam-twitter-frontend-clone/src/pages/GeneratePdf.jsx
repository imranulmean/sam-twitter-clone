import React, { useState } from 'react';
import axios from 'axios';

const GeneratePdf = () => {
  const [resumeData, setResumeData] = useState({
    name: '',
    skills: '',
    experience: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setResumeData({ ...resumeData, [name]: value });
  };
const testData= async()=>{
    const getData= await fetch("http://localhost:3000/");
    console.log(await getData.json());
}
  const handleGeneratePDF = async () => {
    try {
      const response = await axios.post('http://localhost:3000/generateResume', resumeData, { responseType: 'arraybuffer' });
      const blob = new Blob([response.data], { type: 'application/pdf' });      
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'resume.pdf';
      link.click();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <label>
        Name:
        <input type="text" name="name" value={resumeData.name} onChange={handleInputChange} />
      </label>
      <br />
      <label>
        Skills:
        <input type="text" name="skills" value={resumeData.skills} onChange={handleInputChange} />
      </label>
      <br />
      <label>
        Experience:
        <input type="text" name="experience" value={resumeData.experience} onChange={handleInputChange} />
      </label>
      <br />
      <button onClick={handleGeneratePDF}>Generate PDF</button>
      <button onClick={testData}>Test get Data</button>
    </div>
  );
};

export default GeneratePdf;