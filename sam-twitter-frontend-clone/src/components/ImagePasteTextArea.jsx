import React, { useEffect, useRef, useState } from 'react';

const ImagePasteTextArea = ({setTweetText, setImg}) => {
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
      style={{ border: '1px solid #ccc', minHeight: '100px', padding: '8px' }}
      ></div>

    </div>
  );
};

export default ImagePasteTextArea;