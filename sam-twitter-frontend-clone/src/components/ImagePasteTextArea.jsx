import React, { useEffect, useRef, useState } from 'react';

const ImagePasteTextArea = ({setTweetText, setImg}) => {

///////////////////Drag and Drop Image////////////////////////////
// const [image, setImage] = useState(null);

//   const handleDrop = (e) => {
//     e.preventDefault();

//     const file = e.dataTransfer.files[0];
//     if (file && file.type.startsWith('image/')) {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         setImage(event.target.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//   };

///////////////////////////////////////////////  
  const textareaRef = useRef(null);

  const handlePaste = (event) => {
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;

    for (const item of items) {
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        setImg(file);
        event.preventDefault();
      }
    }
  };

  return (
    <div>
      <div contentEditable onPaste={handlePaste} ref={textareaRef} onInput={(e)=>setTweetText(e.target.innerText)}
         style={{ border: '1px solid #ccc', minHeight: '100px', padding: '8px' }}>
      </div>
    {/* /////////////////////// Iage Drag Drop Section //////////////// */}
        {/* <div
            style={{
              width: '300px',
              height: '300px',
              border: '2px dashed #ccc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              cursor: 'pointer',
            }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {image ? (
              <img
                src={image}
                alt="Dropped Image"
                style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '8px' }}
              />
            ) : (
              <p>Drag & Drop Image Here</p>
            )}
        </div>       */}

    </div>
  );
};

export default ImagePasteTextArea;