import React, { useEffect, useState } from 'react';

// @params content => array of objects containing image_url and image_text
const Notes = ({ imageData }) => {
  console.log(imageData);
  // State for editable text and styling options
  const [fontSize, setFontSize] = useState(16); // Font size in pixels
  const [fontName, setFontName] = useState('Arial');
  const [lineHeight, setLineHeight] = useState(1.5); // Line height
  const [letterSpacing, setLetterSpacing] = useState(0); // Letter spacing in em

  // add all text from imageData to a single string
  const allText = imageData.map(content => content.image_text).join(' ');
 
  const test = allText;


  return (
    <div>
      {/* Font Controls */}
      <div className="controls mb-4 space-x-4">
        <label>
          Font Size:
          <input 
            type="range" 
            min="12" 
            max="36" 
            value={fontSize} 
            onChange={(e) => setFontSize(parseInt(e.target.value))} 
            className="ml-2" 
          />
          <span>{fontSize}px</span>
        </label>
        <label>
          Font Name:
          <select 
            value={fontName} 
            onChange={(e) => setFontName(e.target.value)} 
            className="ml-2 border p-1"
          >
            <option value="Arial">Arial</option>
            <option value="Georgia">Georgia</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
            <option value="Verdana">Verdana</option>
          </select>
        </label>
        <label>
          Line Height:
          <input 
            type="range" 
            min="1" 
            max="2.5" 
            step="0.1" 
            value={lineHeight} 
            onChange={(e) => setLineHeight(parseFloat(e.target.value))} 
            className="ml-2"
          />
          <span>{lineHeight}</span>
        </label>
        <label>
          Letter Spacing:
          <input 
            type="range" 
            min="-0.5" 
            max="1" 
            step="0.1" 
            value={letterSpacing} 
            onChange={(e) => setLetterSpacing(parseFloat(e.target.value))} 
            className="ml-2"
          />
          <span>{letterSpacing}em</span>
        </label>
      </div>

    

      <div
        className="p-4 border rounded bg-white"
        style={{
          fontSize: `${fontSize}px`,
          fontFamily: fontName,
          lineHeight: lineHeight,
          letterSpacing: `${letterSpacing}em`,
        }}
      >
        {test}
      </div>
    </div>
  );
};

export default Notes;