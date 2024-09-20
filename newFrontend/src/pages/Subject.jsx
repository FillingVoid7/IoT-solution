import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import './CustomDatePicker.css'; // Your custom styles

// Custom Calendar Component (based on the previous shared design)
const CustomCalendar = ({ selectedDate, onDateChange, highlightedDates }) => {
    const [days, setDays] = useState([]);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i - 5);

    // Helper to get days in the selected month
    const getDaysInMonth = (month, year) => {
        const date = new Date(year, month, 1);
        const daysInMonth = [];
        while (date.getMonth() === month) {
            daysInMonth.push({
                day: date.getDate(),
                month: date.getMonth(),
                year: date.getFullYear(),
                isSelected: date.toDateString() === selectedDate.toDateString(),
                isWeekend: date.getDay() === 0 || date.getDay() === 6,
                isHighlighted: highlightedDates.some(highlightedDate => 
                    dayjs(highlightedDate).isSame(date, 'day')
                )
            });
            date.setDate(date.getDate() + 1);
        }
        return daysInMonth;
    };

    // Initialize days based on selected date
    useEffect(() => {
        setDays(getDaysInMonth(selectedDate.getMonth(), selectedDate.getFullYear()));
    }, [selectedDate, highlightedDates]);

    const handleDateChange = (day) => {
        onDateChange(new Date(day.year, day.month, day.day));
    };

    const handleMonthChange = (month) => {
        onDateChange(new Date(selectedDate.getFullYear(), month, selectedDate.getDate()));
    };

    const handleYearChange = (year) => {
        onDateChange(new Date(year, selectedDate.getMonth(), selectedDate.getDate()));
    };

    return (
        <div className="custom-calendar">
            <div className="calendar-header">
                <select value={selectedDate.getMonth()} onChange={(e) => handleMonthChange(parseInt(e.target.value))}>
                    {months.map((month, index) => (
                        <option key={index} value={index}>{month}</option>
                    ))}
                </select>
                <select value={selectedDate.getFullYear()} onChange={(e) => handleYearChange(parseInt(e.target.value))}>
                    {years.map((year, index) => (
                        <option key={index} value={year}>{year}</option>
                    ))}
                </select>
            </div>

            <div className="calendar-grid">
                {daysOfWeek.map((day, index) => (
                    <div key={index} className="calendar-day-header">{day}</div>
                ))}

                {days.map((day, index) => (
                    <button 
                        key={index} 
                        onClick={() => handleDateChange(day)}
                        className={`calendar-day ${day.isSelected ? 'selected' : ''} ${day.isWeekend ? 'weekend' : ''} ${day.isHighlighted ? 'highlighted' : ''}`}
                    >
                        {day.day}
                    </button>
                ))}
            </div>
        </div>
    );
};

function Subject() {
    const { subjectName } = useParams();
    const [dates, setDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date()); // Set today's date as default
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSubject = async () => {
            const response = await axios.get(`http://localhost:3000/getSubjectData/${subjectName}`);
            setDates(response.data.map(date => new Date(date))); // Convert to Date objects
        };
        fetchSubject();
    }, [subjectName]);

    const handleDateChange = (date) => {
        setSelectedDate(date);
        const formattedDate = dayjs(date).format('YYYY-MM-DD');
        navigate(`/subject/${subjectName}/${formattedDate}`); // Update the URL
    };

    return (
        <div className="subject-container">
            <h1 className="text-2xl font-bold my-4 text-center">{subjectName}</h1>
            <CustomCalendar 
                selectedDate={selectedDate} 
                onDateChange={handleDateChange} 
                highlightedDates={dates} // Highlight specific dates
            />
            <div className="date-info text-center">
                <p className="text-gray-700">{dayjs(selectedDate).format('dddd, MMMM DD YYYY')}</p>
            </div>
        </div>
    );
}

export default Subject;
