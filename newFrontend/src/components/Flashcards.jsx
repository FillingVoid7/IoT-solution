import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Flashcards = ({ imageData }) => {
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const { date, subjectName } = useParams();

  useEffect(() => {
    const generateFlashCards = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/generateFlashcards/${date}?subjectName=${subjectName}`);
        setFlashcards(res.data.flashcards);
      } catch (error) {
        console.error("Error fetching flashcards:", error);
      }
    };
    generateFlashCards();
  }, [date, subjectName]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length);
  };

  if (flashcards.length === 0) {
    return <div style={{ textAlign: 'center', padding: '1rem' }}>Loading flashcards...</div>;
  }

  const currentCard = flashcards[currentIndex];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      maxHeight: '50vh',
      padding: '1rem',
    }}>
      <div 
        onClick={handleFlip}
        style={{
          width: '20rem',
          height: '12rem',
          perspective: '1000px',
          cursor: 'pointer',
          position: 'relative',
          transition: 'transform 0.6s',
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : ''
        }}
      >
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{currentCard.front}</h3>
        </div>
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transform: 'rotateY(180deg)'
        }}>
          <p style={{ fontSize: '1rem' }}>{currentCard.back}</p>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '20rem', marginTop: '1rem' }}>
        <button onClick={handlePrevious} style={buttonStyle}>Previous</button>
        <button onClick={handleFlip} style={buttonStyle}>Flip</button>
        <button onClick={handleNext} style={buttonStyle}>Next</button>
      </div>
      <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
        Card {currentIndex + 1} of {flashcards.length}
      </p>
    </div>
  );
};

const buttonStyle = {
  padding: '0.5rem 1rem',
  backgroundColor: '#e5e7eb',
  border: 'none',
  borderRadius: '0.25rem',
  cursor: 'pointer',
  fontSize: '0.875rem',
  transition: 'background-color 0.3s',
};

export default Flashcards;