import React, { useEffect } from 'react'
import { useState } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import axios from 'axios'
function Subject() {
    const params = useParams()
    const [subjectName, setSubjectName] = useState(params.subjectName)
    const [dates, setDates] = useState([])

    useEffect(() => {
         const fetchSubject = async() => {
            const response = await axios.get(`http://localhost:3000/getSubjectData/${subjectName}`)
            setDates(response.data)
            console.log(response.data)
         }
            fetchSubject()
    },[])
  return (
    <div>
        <h1>{subjectName}</h1>
            {dates}
    </div>
  )
}

export default Subject