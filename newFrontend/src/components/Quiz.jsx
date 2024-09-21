import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Quiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizData, setQuizData] = useState([]);
  const [answerStatus, setAnswerStatus] = useState(null);
  const { date, subjectName } = useParams();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/generateQuizes/${date}?subjectName=${subjectName}`);
        setQuizData(res.data);
        console.log(res.data);
      } catch (error) {
        console.error('Error fetching quiz:', error);
      }
    };
    fetchQuiz();
  }, [date, subjectName]);

  const currentQuestion = quizData[currentQuestionIndex];

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    if (answer === currentQuestion.answer) {
      setAnswerStatus('correct');
      setScore(score + 1);
    } else {
      setAnswerStatus('incorrect');
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setAnswerStatus(null);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswerStatus(null);
  };

  if (quizData.length === 0) {
    return <div>Loading quiz...</div>;
  }

  if (showResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
          <p className="text-lg mb-4">Your score: {score} out of {quizData.length}</p>
          <button
            onClick={resetQuiz}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          >
            Restart Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
        {answerStatus && (
          <div className={`mb-4 p-2 rounded ${answerStatus === 'correct' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {answerStatus === 'correct' ? 'Correct!' : 'Incorrect. The correct answer is: ' + currentQuestion.answer}
          </div>
        )}
        <h2 className="text-xl font-semibold mb-4">Question {currentQuestionIndex + 1} of {quizData.length}</h2>
        <p className="text-lg mb-4">{currentQuestion.question}</p>
        <div className="space-y-2">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              disabled={selectedAnswer !== null}
              className={`w-full text-left py-2 px-4 rounded transition-colors ${
                selectedAnswer === option
                  ? option === currentQuestion.answer
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                  : selectedAnswer !== null && option === currentQuestion.answer
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <button
          onClick={handleNextQuestion}
          disabled={selectedAnswer === null}
          className={`mt-6 w-full py-2 px-4 rounded transition-colors ${
            selectedAnswer !== null
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {currentQuestionIndex === quizData.length - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default Quiz;