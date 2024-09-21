import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCog, FaTimes, FaMoon, FaSun } from 'react-icons/fa';

const Notes = ({ imageData }) => {
  const [fontSize, setFontSize] = useState(16);
  const [fontName, setFontName] = useState('Arial');
  const [lineHeight, setLineHeight] = useState(1.5);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [noteText, setNoteText] = useState('');

  const { date } = useParams();

  useEffect(() => {
    const allText = imageData.map((content) => content.image_text).join('\n\n');
    setNoteText(allText);
  }, [imageData]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100 text-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-minibold">Date: {date}</h1>
          </div>
          <div className="space-x-4">
            <button
              onClick={toggleTheme}
              className="flex items-center p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition duration-300"
            >
              {isDarkMode ? <FaSun className="text-yellow-500 text-xl" /> : <FaMoon className="text-gray-800 text-xl" />}
            </button>
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition duration-300"
            >
              <FaCog className="text-xl" />
            </button>
          </div>
        </header>

        <motion.div
          className="p-6 rounded-lg shadow-lg bg-white"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className={`w-full h-[60vh] p-4 rounded border overflow-auto transition-all duration-300 ${
              isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-900'
            }`}
            style={{
              fontSize: `${fontSize}px`,
              fontFamily: fontName,
              lineHeight: lineHeight,
              letterSpacing: `${letterSpacing}em`,
            }}
          >
            {noteText}
          </div>
        </motion.div>
      </motion.div>

      {isSettingsModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Text Settings</h2>
              <button
                onClick={() => setIsSettingsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block mb-2">Font Size: {fontSize}px</label>
                <input
                  type="range"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  min={12}
                  max={36}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block mb-2">Line Height: {lineHeight}</label>
                <input
                  type="range"
                  value={lineHeight}
                  onChange={(e) => setLineHeight(Number(e.target.value))}
                  min={1}
                  max={2}
                  step={0.1}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block mb-2">Letter Spacing: {letterSpacing}em</label>
                <input
                  type="range"
                  value={letterSpacing}
                  onChange={(e) => setLetterSpacing(Number(e.target.value))}
                  min={0}
                  max={0.5}
                  step={0.05}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block mb-2">Font Name:</label>
                <select
                  value={fontName}
                  onChange={(e) => setFontName(e.target.value)}
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="Arial">Arial</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Courier New">Courier New</option>
                  <option value="Verdana">Verdana</option>
                </select>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Notes;
