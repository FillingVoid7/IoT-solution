import React, { useState, useEffect, useRef } from 'react';

const Notes = ({ contents }) => {
  const [fontSize, setFontSize] = useState('16px');
  const [fontName, setFontName] = useState('Arial');
  const [lineHeight, setLineHeight] = useState('1.5');
  const [letterSpacing, setLetterSpacing] = useState('normal');
  const [textToSpeak, setTextToSpeak] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);

  const speechRef = useRef(null);
  const textRef = useRef(null);

  const test = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

  useEffect(() => {
    if ('speechSynthesis' in window) {
      speechRef.current = new SpeechSynthesisUtterance();
      speechRef.current.onboundary = handleBoundary;
      speechRef.current.onend = handleSpeechEnd;
    }
    return () => {
      if (speechRef.current) {
        speechRef.current.onboundary = null;
        speechRef.current.onend = null;
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleTextToSpeech = () => {
    if ('speechSynthesis' in window) {
      if (!isPlaying) {
        const text = textToSpeak || test;
        speechRef.current.text = text;
        window.speechSynthesis.speak(speechRef.current);
        setIsPlaying(true);
      } else {
        window.speechSynthesis.resume();
      }
    } else {
      console.error('Text-to-speech not supported in this browser');
      alert('Text-to-speech is not supported in your browser');
    }
  };

  const handlePauseSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    }
  };

  const handleStopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setCurrentWordIndex(-1);
    }
  };

  const handleBoundary = (event) => {
    if (event.name === 'word') {
      setCurrentWordIndex(event.charIndex);
    }
  };

  const handleSpeechEnd = () => {
    setIsPlaying(false);
    setCurrentWordIndex(-1);
  };

  const highlightText = () => {
    if (textRef.current && currentWordIndex >= 0) {
      const text = textToSpeak || test;
      const beforeHighlight = text.slice(0, currentWordIndex);
      const highlightedWord = text.slice(currentWordIndex, text.indexOf(' ', currentWordIndex));
      const afterHighlight = text.slice(text.indexOf(' ', currentWordIndex));

      return (
        <>
          {beforeHighlight}
          <span className="bg-yellow-300">{highlightedWord}</span>
          {afterHighlight}
        </>
      );
    }
    return textToSpeak || test;
  };

  return (
    <div>
      {/* Font Controls */}
      <div className="controls mb-4 space-x-4">
        <label>
          Font Size:
          <input 
            type="number" 
            value={parseInt(fontSize)} 
            onChange={(e) => setFontSize(`${e.target.value}px`)} 
            className="ml-2 border p-1" 
          />
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
            type="number" 
            step="0.1" 
            value={lineHeight} 
            onChange={(e) => setLineHeight(e.target.value)} 
            className="ml-2 border p-1" 
          />
        </label>
        <label>
          Letter Spacing:
          <input 
            type="number" 
            step="0.1" 
            value={parseFloat(letterSpacing)} 
            onChange={(e) => setLetterSpacing(`${e.target.value}em`)} 
            className="ml-2 border p-1" 
          />
        </label>
      </div>

      {/* Text-to-Speech Buttons */}
      <div className="mb-4 space-x-2">
        <button 
          onClick={handleTextToSpeech} 
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {isPlaying ? 'Resume' : 'Play'}
        </button>
        <button 
          onClick={handlePauseSpeech} 
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Pause
        </button>
        <button 
          onClick={handleStopSpeech} 
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Stop
        </button>
      </div>

      {/* Editable Text Area */}
      <div
        ref={textRef}
        contentEditable
        className="editable-area p-4 border rounded bg-white"
        style={{
          fontSize: fontSize,
          fontFamily: fontName,
          lineHeight: lineHeight,
          letterSpacing: letterSpacing,
        }}
        onInput={(e) => setTextToSpeak(e.target.textContent)}
        suppressContentEditableWarning={true}
      >
        {highlightText()}
      </div>
    </div>
  );
};

export default Notes;




//     const allText = contents.map(content => content.image_text).join(' ');

{/* <h1>Notes Component</h1> */}
        {/* <div className="grid grid-cols-2 gap-4">
          {contents.map((content, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md">
              <img src={content.image_url} alt="Note" className="w-full h-48 object-cover rounded-lg" />
              <p className="text-sm mt-2">{content.image_text}</p>
            </div>
          ))}
  
          {contents.length === 0 && (
            <div className="bg-white p-4 rounded-lg shadow-md text-center">
              <p>No notes available</p>
              </div>
          )}
          </div> */}