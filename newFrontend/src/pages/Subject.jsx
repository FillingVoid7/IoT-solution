import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';

const CustomCalendar = ({ selectedDate, onDateChange, availableDates }) => {
    const [days, setDays] = useState([]);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i - 5);

    const getDaysInMonth = (month, year) => {
        const date = new Date(year, month, 1);
        const daysInMonth = [];
        while (date.getMonth() === month) {
            const isAvailable = availableDates.some(availableDate => 
                dayjs(availableDate).isSame(date, 'day')
            );
            daysInMonth.push({
                day: date.getDate(),
                month: date.getMonth(),
                year: date.getFullYear(),
                isSelected: date.toDateString() === selectedDate.toDateString(),
                isSaturday: date.getDay() === 6,
                isAvailable: isAvailable
            });
            date.setDate(date.getDate() + 1);
        }
        return daysInMonth;
    };

    useEffect(() => {
        setDays(getDaysInMonth(selectedDate.getMonth(), selectedDate.getFullYear()));
    }, [selectedDate, availableDates]);

    const handleDateChange = (day) => {
        if (day.isAvailable) {
            onDateChange(new Date(day.year, day.month, day.day));
        }
    };

    const handleMonthChange = (month) => {
        onDateChange(new Date(selectedDate.getFullYear(), month, 1));
    };

    const handleYearChange = (year) => {
        onDateChange(new Date(year, selectedDate.getMonth(), 1));
    };

    return (
        <div className="flex flex-col p-6 bg-white shadow-xl rounded-lg w-full">
            <div className="flex justify-between mb-6">
                <select
                    value={selectedDate.getMonth()}
                    onChange={(e) => handleMonthChange(parseInt(e.target.value))}
                    className="border border-gray-300 rounded p-2 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                    {months.map((month, index) => (
                        <option key={index} value={index}>
                            {month}
                        </option>
                    ))}
                </select>
                <select
                    value={selectedDate.getFullYear()}
                    onChange={(e) => handleYearChange(parseInt(e.target.value))}
                    className="border border-gray-300 rounded p-2 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                    {years.map((year, index) => (
                        <option key={index} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-4">
                {daysOfWeek.map((day, index) => (
                    <div key={index} className="font-bold text-center text-gray-700">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
                {days.map((day, index) => (
                    <button
                        key={index}
                        onClick={() => handleDateChange(day)}
                        className={`p-2 text-center rounded transition-colors duration-300 ease-in-out transform ${
                            day.isSelected ? 'bg-blue-600 text-white scale-110' : 'bg-gray-50 text-gray-850'
                        } ${day.isSaturday ? 'bg-red-400' : 'text-white-600'} ${
                            day.isAvailable ? 'hover:bg-green-400 bg-green-500 transition-all duration-300 transform hover:scale-105' : 'cursor-not-allowed bg-gray-300 text-gray-400'
                        }`}
                        disabled={!day.isAvailable}
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
    const [availableDates, setAvailableDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSubject = async () => {
            const response = await axios.get(`http://localhost:3000/getSubjectData/${subjectName}`);
            setAvailableDates(response.data.map(date => new Date(date)));
        };
        fetchSubject();
    }, [subjectName]);

    const handleDateChange = (date) => {
        setSelectedDate(date);
        const formattedDate = dayjs(date).format('YYYY-MM-DD');
        navigate(`/subject/${subjectName}/${formattedDate}`);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500">
            <div className="w-full m-8 p-6 space-y-6 bg-gray-50 rounded-lg shadow-lg">
                <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-800 tracking-wide">
                    {subjectName}
                </h1>
                
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="w-5 h-5 bg-green-500 rounded-full"></div>
                    <h1 className="text-lg text-gray-600">Available Notes</h1>
                </div>
                
                <div className="text-center mb-8">
                    <p className="text-xl text-gray-700 font-medium">
                        Today: {dayjs(selectedDate).format('dddd, MMMM DD YYYY')}
                    </p>
                </div>
                
                <CustomCalendar 
                    selectedDate={selectedDate} 
                    onDateChange={handleDateChange} 
                    availableDates={availableDates}
                />
            </div>
        </div>
    );
}

export default Subject;
