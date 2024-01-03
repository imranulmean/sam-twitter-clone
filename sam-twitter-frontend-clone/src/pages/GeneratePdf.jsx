import React, { useState } from 'react';
import axios from 'axios';

const ResumeForm = () => {
  const [resumeData, setResumeData] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setResumeData({ ...resumeData, [name]: value });
  };

  const handleGeneratePDF = async () => {
    try {
      const response = await axios.post('http://localhost:3001/generateResume', resumeData, { responseType: 'arraybuffer' });
      
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
      {/* Your form fields for resume data */}
      <button onClick={handleGeneratePDF}>Generate PDF</button>
    </div>
  );
};

export default ResumeForm;