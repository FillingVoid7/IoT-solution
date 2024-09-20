import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';

const App = () => {
  const [data, setData] = useState({}); // To store the fetched data

  // Fetch example data from backend
  useEffect(() => {
    fetch('http://localhost:3000/get-all-subject') // Replace with your API endpoint
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    // <div className="container">
    //   <h1>Subjects and Images</h1>
    //   {Object.keys(data).length > 0 ? (
    //     Object.keys(data).map((subject) => (
    //       <div key={subject}>
    //         <h2>{subject}</h2>
    //         {data[subject].map((record, index) => (
    //           <div key={index} style={{ marginBottom: '20px' }}>
    //             <h3>Date: {record.date}</h3>
    //             <div className="images">
    //               {record.images.map((imageUrl, idx) => (
    //                 <img
    //                   key={idx}
    //                   src={imageUrl}
    //                   alt={`Image ${idx}`}
    //                   style={{ width: '150px', marginRight: '10px' }}
    //                 />
    //               ))}
    //             </div>
    //           </div>
    //         ))}
    //       </div>
    //     ))
    //   ) : (
    //     <p>Loading data...</p>
    //   )}
    // </div>

    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
          {/* <Route path="/:subject" element={<Subject data={data} />} />
          <Route path="/:subject/:date" element={<Date data={data} />} />
          <Route path="*" element={<Navigate to="/" />} /> */}
      </Routes>
     
  </Router>

  );
};

export default App;
