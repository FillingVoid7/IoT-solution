import React, { useEffect } from 'react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
function Subject() {
    const params = useParams()
    const [subjectName, setSubjectName] = useState(params.subjectName)
    const [dates, setDates] = useState([])

    useEffect(() => {
         const fetchSubject = async() => {
            const response = await axios.get(`process.env.REACT_APP_API_URL/getSubjectData/${params.subjectName}`)
            console.log(response)
         }
            fetchSubject()
    })
  return (
    <div>
        <h1>{subjectName}</h1>
            {dates}
    </div>
  )
}

export default Subject