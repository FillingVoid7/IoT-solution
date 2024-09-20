import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Home() {
    const [data, setData] = useState([]); // Store fetched data
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    // Hardcoded test subjects
    const testSubject= ['Math', 'Physics', 'Chemistry'];
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/get-all-subject');
                setData(response.data); // Store fetched data
                setLoading(false); // Set loading to false
            } catch (err) {
                setError('Error fetching data');
                setLoading(false); // Set loading to false
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Show loading indicator
    }

    if (error) {
        return <div>{error}</div>; // Show error message
    }

    return (
        <div>
            <h1>Home</h1>

            {/* Render hardcoded subjects */}
            <h2>Test Subjects:</h2>
            {testSubject.map((subject) => (
                <div key={subject} className='flex bg-gray-400 gap-4'>
                    {subject}
                </div>
            ))}

            {/* Render fetched data */}
            <h2>Fetched Subjects:</h2>
            {data.length > 0 ? (
                data.map((subject, index) => (
                    <div key={index} className='flex bg-gray-300 gap-4'>
                        {subject}
                    </div>
                ))
            ) : (
                <div>No subjects found</div>
            )}
        </div>
    );
}

export default Home;
