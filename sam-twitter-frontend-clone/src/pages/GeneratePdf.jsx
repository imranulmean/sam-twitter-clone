import React, { useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import ChattingMern from '../components/chatting-mern';
import VideoTranscoder from '../components/videoTranscoder';

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
  const handleGeneratePDF = async () => {
    try {
      const response = await axios.post('http://localhost:3000/generateResume', resumeData, { responseType: 'arraybuffer' });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      saveAs(blob,"resume.pdf")
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
      <ChattingMern />
      <VideoTranscoder />
    </div>
  );
};

export default GeneratePdf;