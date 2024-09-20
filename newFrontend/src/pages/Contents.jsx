import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function Contents() {
  const { date, subjectName } = useParams();
  const [contents, setContents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const formattedDate = `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`;
        const response = await axios.get(`http://localhost:3000/getSubjectContent/${formattedDate}?subjectName=${subjectName}`);
        setContents(response.data.content || []);
      } catch (error) {
        console.error("Error fetching contents:", error);
      }
    };

    if (date && subjectName) {
      fetchContents();
    }
  }, [date, subjectName, selectedDate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-6">Content for {subjectName}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contents.length > 0 ? (
          contents.map((content, index) => (
            <div key={index} className="flex flex-col items-center p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
              <img src={content.image_url} alt={content.image_text} className="max-w-md h-auto"/>
              <p className="mt-3 text-lg font-medium">{content.image_text}</p>
            </div>
          ))
        ) : (
          <p className="text-center">No content available.</p>
        )}
      </div>

      <div className="max-w-sm mx-auto my-4">
        <DatePicker
          selected={selectedDate}
          onChange={date => setSelectedDate(date)}
          className="form-input block w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholderText="Select date"
        />
      </div>
    </div>
  );
}

export default Contents;
