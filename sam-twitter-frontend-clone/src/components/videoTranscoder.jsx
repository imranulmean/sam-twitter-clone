import React, { useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';

const VideoTranscoder = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [selectedVideo, setSelectedVideo]= useState("");

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setUploadedFile(file);
    const previewUrl=URL.createObjectURL(file);
    setSelectedVideo(previewUrl);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleUpload = async () => {
    if (uploadedFile) {
      const formData = new FormData();
      formData.append('video', uploadedFile);
      try {
        const response = await axios.post('http://localhost:3000/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log('File uploaded successfully:', response.data);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  return (
    <div>
      <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''} border-2`}>
        <input {...getInputProps()} />
        { selectedVideo &&
            <video controls className='h-auto w-40'>
                <source src={selectedVideo} type="video/mp4" />
            </video>            
        }

        <p>Drag & drop a video file here, or click to select one</p>
      </div>
      <button onClick={handleUpload}>Upload Video</button>
    </div>
  );
};

export default VideoTranscoder;