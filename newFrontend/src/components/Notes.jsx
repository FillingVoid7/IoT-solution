  import React, { useState } from 'react';
  import { useParams } from 'react-router-dom';
  import axios from 'axios';

  const Notes = ({ imageData }) => {
    const [fontSize, setFontSize] = useState(16);
    const [fontName, setFontName] = useState('Arial');
    const [lineHeight, setLineHeight] = useState(1.5);
    const [letterSpacing, setLetterSpacing] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [quizData, setQuizData] = useState(null);
    const [flashcardData, setFlashcardData] = useState([]);
    const [isFlashcardModalOpen, setIsFlashcardModalOpen] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const { date, subjectName } = useParams();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Function to go to the next question
  const nextQuestion = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Function to go to the previous question
  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

    const allText = imageData.map(content => content.image_text).join(' ');

    const handleGenerateQuiz = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:3000/generateQuizes/${date}?subjectName=${subjectName}`);
        setQuizData(response.data);
        setIsLoading(false);
        console.log('Quiz generated:', response.data);
      } catch (error) {
        setIsLoading(false);
        console.error('Error generating quiz:', error);
      }
    };

    const handleGenerateFlashcards = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:3000/generateFlashcards/${date}?subjectName=${subjectName}`);
        setFlashcardData(response.data.flashcards);
        setIsFlashcardModalOpen(true);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error('Error generating flashcards:', error);
      }
    };

    const closeFlashcardModal = () => {
      setIsFlashcardModalOpen(false);
      setCurrentFlashcardIndex(0);
      setIsFlipped(false);
    };

    const nextFlashcard = () => {
      if (currentFlashcardIndex < flashcardData.length - 1) {
        setCurrentFlashcardIndex(currentFlashcardIndex + 1);
        setIsFlipped(false);
      }
    };

    const prevFlashcard = () => {
      if (currentFlashcardIndex > 0) {
        setCurrentFlashcardIndex(currentFlashcardIndex - 1);
        setIsFlipped(false);
      }
    };

    const flipFlashcard = () => {
      setIsFlipped(!isFlipped);
    };

    const handleAnswerClick = (questionIndex, option) => {
      setSelectedAnswers(prev => ({
        ...prev,
        [questionIndex]: option.correct
      }));
    };

    if (isLoading) {
      return (
        <div className="p-4 max-w-4xl mx-auto text-center">Loading...</div>
      );
    }

    return (
      <div className="p-4 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{subjectName} Notes - {date}</h1>
          <button onClick={() => setIsSettingsModalOpen(true)} className="px-4 py-2 bg-gray-200 rounded">
            Settings
          </button>
        </div>

        <div className="mb-4 flex space-x-4">
          <button onClick={handleGenerateQuiz} className="px-4 py-2 bg-blue-500 text-white rounded">
            Generate Quiz
          </button>
          <button onClick={handleGenerateFlashcards} className="px-4 py-2 bg-green-500 text-white rounded">
            Generate Flashcards
          </button>
        </div>

        <div className="mb-4 p-4 border rounded bg-white">
          <div
            style={{
              fontSize: `${fontSize}px`,
              fontFamily: fontName,
              lineHeight: lineHeight,
              letterSpacing: `${letterSpacing}em`,
            }}
          >
            {allText}
          </div>
        </div>

        {quizData && (
    <div className="mb-4 p-4 border rounded bg-white">
      <h2 className="text-xl font-bold mb-2">Generated Quiz:</h2>
      <p className="mb-2">
        Question {currentQuestionIndex + 1} of {quizData.length}
      </p>
      <div>
        <p className="font-semibold">{quizData[currentQuestionIndex].question}</p>
        <ul className="list-disc pl-8">
          {quizData[currentQuestionIndex].options.map((option, optionIndex) => (
            <li 
              key={optionIndex} 
              onClick={() => handleAnswerClick(currentQuestionIndex, option)} 
              className={`cursor-pointer ${selectedAnswers[currentQuestionIndex] !== undefined ? 
                (option.correct ? "text-green-600" : "text-red-600") : ""}`}
            >
              {option.answer} 
              {selectedAnswers[currentQuestionIndex] !== undefined && (
                <span>
                  {option.correct ? " (Correct)" : " (Incorrect)"}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex justify-between mt-4">
        <button onClick={prevQuestion} disabled={currentQuestionIndex === 0} className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50">
          Previous
        </button>
        <button onClick={nextQuestion} disabled={currentQuestionIndex === quizData.length - 1} className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50">
          Next
        </button>
      </div>
    </div>
  )}

        {isFlashcardModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
              <button onClick={closeFlashcardModal} className="float-right">&times;</button>
              <h2 className="text-xl font-bold mb-4">Flashcard {currentFlashcardIndex + 1} of {flashcardData.length}</h2>
              <div 
                className="flashcard-container mb-4 h-64 w-full perspective-1000"
                onClick={flipFlashcard}
              >
                <div className={`flashcard relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                  <div className="flashcard-front absolute w-full h-full backface-hidden flex items-center justify-center p-4 bg-blue-100 rounded">
                    <p className="text-center">{flashcardData[currentFlashcardIndex]?.question}</p>
                  </div>
                  <div className="flashcard-back absolute w-full h-full backface-hidden flex items-center justify-center p-4 bg-green-100 rounded rotate-y-180">
                    <p className="text-center">{flashcardData[currentFlashcardIndex]?.answer}</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <button onClick={prevFlashcard} disabled={currentFlashcardIndex === 0} className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50">Previous</button>
                <button onClick={nextFlashcard} disabled={currentFlashcardIndex === flashcardData.length - 1} className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50">Next</button>
              </div>
            </div>
          </div>
        )}

        {isSettingsModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Text Settings</h2>
              <div className="space-y-4">
                <div>
                  <label>Font Size: {fontSize}px</label>
                  <input
                    type="range"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    min={12}
                    max={24}
                    className="w-full"
                  />
                </div>
                <div>
                  <label>Line Height: {lineHeight}</label>
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
                  <label>Letter Spacing: {letterSpacing}em</label>
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
                  <label>Font Name:</label>
                  <input
                    type="text"
                    value={fontName}
                    onChange={(e) => setFontName(e.target.value)}
                    className="border border-gray-300 rounded p-2 w-full"
                  />
                </div>
              </div>
              <button onClick={() => setIsSettingsModalOpen(false)} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Close</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  export default Notes;
