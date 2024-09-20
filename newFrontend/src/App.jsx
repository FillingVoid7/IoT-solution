import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';  // Import the new Layout component
import Home from './pages/Home';
import Subject from './pages/Subject';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Use Layout component to wrap around common layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="subject/:subjectName" element={<Subject />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
