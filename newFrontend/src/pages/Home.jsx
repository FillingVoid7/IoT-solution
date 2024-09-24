import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const response = await axios.get('http://localhost:3000/get-all-subjects');
        setSubjects(response.data);
      } catch (err) {
        setError('Failed to load subjects');
      } finally {
        setLoading(false);
      }
    };
    fetchHome();
  }, []);

  const totalBoxes = 6;
  const filledSubjects = [...subjects];
  while (filledSubjects.length < totalBoxes) {
    filledSubjects.push('No Subject');
  }

  const handleSubjectClick = (subject) => {
    if (subject !== 'No Subject') {
      navigate(`/subject/${subject}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 to-indigo-200">
      {/* Header Bar */}
      <div className="w-full bg-blue-900 py-6 shadow-lg">
        <div className='text-left'><img src='/logo.png' onClick={() => navigate('/')} alt="Y" className="h-10 mx-auto cursor-pointer" />
        </div>
        <h1 className="text-white text-center text-3xl font-bold mt-2">
          Choose Your Subject
        </h1>
      </div>

      <div className="flex flex-wrap justify-center mt-10 gap-6">
        {filledSubjects.map((subject, index) =>
          subject !== 'flashcards' && subject !== 'quizes' && (
            <div
              key={index}
              className="w-80 h-20 bg-white rounded-lg shadow-2xl flex items-center justify-center transition-transform transform hover:scale-105 cursor-pointer border-2 border-blue-300 hover:border-blue-500"
              onClick={() => handleSubjectClick(subject)}
            >
              <span className={`text-2xl ${subject !== 'No Subject' ? 'font-semibold text-blue-800' : 'text-gray-500'}`}>
                {subject}
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default Home;
