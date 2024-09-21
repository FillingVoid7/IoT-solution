import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import React Router's navigate hook

function Home() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate(); // React Router navigate

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

  // Define the number of total boxes (6)
  const totalBoxes = 6;

  // Fill in subjects with "No Subject" if there are fewer than 6
  const filledSubjects = [...subjects];
  while (filledSubjects.length < totalBoxes) {
    filledSubjects.push('No Subject');
  }

  // Handle subject click to navigate
  const handleSubjectClick = (subject) => {
    if (subject !== 'No Subject') {
      navigate(`/subject/${subject}`); // Redirect to subject page
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
    <div className="min-h-screen bg-gray-100">
      {/* Header Bar */}
      <div className="w-full bg-blue-900 py-4">
        <h1 className="text-white text-center text-2xl font-bold">
          Choose your subject:
        </h1>
      </div>

      <div className="flex flex-wrap justify-center mt-10 gap-6">
        {filledSubjects.map((subject, index) => (
          <div
            key={index}
            className="w-80 h-40 bg-gray-200 rounded-lg shadow-lg flex items-center justify-center transition-transform transform hover:scale-110 cursor-pointer"
            onClick={() => handleSubjectClick(subject)} // Add click handler
          >
            <span className={`text-lg ${subject !== 'No Subject' ? 'font-bold' : ''}`}>
              {subject !== 'No Subject' ? subject.replace('-', ' ') : subject}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
