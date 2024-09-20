import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Home() {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchHome = async () => {
      const response = await axios.get('http://localhost:3000/get-all-subjects');
      setSubjects(response.data);
      console.log(response.data);
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
            className="w-80 h-40 bg-gray-200 rounded-lg shadow-lg flex items-center justify-center transition-transform transform hover:scale-110"
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
