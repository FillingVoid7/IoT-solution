import React, { useEffect, useState } from 'react'
import axios from 'axios'

function Home() {
  const [subjects, setSubjects] = useState([])
    useEffect(() => {
        const fetchHome = async() => {
            const response = await axios.get(`http://localhost:3000/get-all-subjects`);
            setSubjects(response.data)
            console.log(response)
        }
        fetchHome()
    },[])
  return (
    <div>{subjects}</div>
  )
}

export default Home