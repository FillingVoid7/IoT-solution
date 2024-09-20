import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Contents() {
  const { date, subjectName } = useParams();
  const [contents, setContents] = useState([]);

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/getSubjectContent/${date}?subjectName=${subjectName}`);
        setContents(response.data.content || []);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching contents:", error);
      }
    };

    fetchContents();
  }, [date, subjectName]);

  return (
    <div>
      {contents.length > 0 ? (
        contents.map((content, index) => (
          <div key={index}>
            <img src={content.image_url} alt={content.image_text} />
            <p>{content.image_text}</p>
          </div>
        ))
      ) : (
        <p>No content available.</p>
      )}
    </div>
  );
}

export default Contents;
