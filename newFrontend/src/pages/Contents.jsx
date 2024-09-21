import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  MdHome,
  MdNotes,
  MdMic,
  MdHelp,
  MdCreditCard,
  MdChevronRight,
  MdDashboard,
} from "react-icons/md";
import Notes from "../components/Notes";
import Voice from "../components/Voice";
import { motion } from 'framer-motion';
import Flashcards from "../components/Flashcards";
import Quiz from "../components/Quiz";
// Placeholder components for each section



const DashboardItem = ({ icon: Icon, label, onClick, isActive }) => {
  return (
    <motion.button
      className={`
        relative overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200
        shadow-md hover:shadow-lg transition-all duration-300 ease-in-out
        p-6 rounded-xl flex flex-col items-center justify-center space-y-3
        ${isActive ? "ring-2 ring-blue-500" : ""}
      `}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute inset-0 bg-blue-300 opacity-0"
        initial={false}
        animate={isActive ? { opacity: 0.2 } : { opacity: 0 }}
        transition={{ duration: 0.3 }}
      />
      
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Icon className={`w-8 h-8 ${isActive ? "text-blue-600" : "text-blue-500"}`} />
      </motion.div>
      
      <motion.span 
        className={`font-semibold ${isActive ? "text-blue-700" : "text-blue-600"}`}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {label}
      </motion.span>
      
      <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 transform scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100" />
    </motion.button>
  );
};


const Breadcrumbs = ({ subjectName, activeComponent, onNavigate }) => (
  <nav className="flex" aria-label="Breadcrumb">
    <ol className="inline-flex items-center space-x-1 md:space-x-3">
      <li className="inline-flex items-center">
        <button
          onClick={() => onNavigate("Dashboard")}
          className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
        >
          <MdHome className="mr-2 w-4 h-4" />
          Dashboard
        </button>
      </li>
      {activeComponent && activeComponent !== "Dashboard" && (
        <li>
          <div className="flex items-center">
            <MdChevronRight className="w-6 h-6 text-gray-400" />
            <span className="ml-1 text-sm font-medium text-gray-700">
              {activeComponent}
            </span>
          </div>
        </li>
      )}
    </ol>
  </nav>
);

function Contents() {
  const { date, subjectName } = useParams();
  const navigate = useNavigate();
  const [contents, setContents] = useState([]);
  const [activeComponent, setActiveComponent] = useState("Home");
  const currentDate = new Date();
  const month = currentDate.toLocaleString("default", { month: "long" });
  const day = currentDate.getDate();
  useEffect(() => {
    setActiveComponent("Dashboard"); // Set default active component
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/getSubjectContent/${date}?subjectName=${subjectName}`
        );
        console.log(response.data);
        setContents(response.data.content || []);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };
    fetchData();
  }, []);

  const audioData = [];
  const imageData = [];

  // Iterate over the content array
  contents.forEach((item) => {
    // Check for audio properties
    if (item.audio_text && item.audio_url) {
      audioData.push({
        audio_text: item.audio_text,
        audio_url: item.audio_url,
      });
    }

    // Check for image properties
    if (item.image_text && item.image_url) {
      imageData.push({
        image_text: item.image_text,
        image_url: item.image_url,
      });
    }
  });

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/getSubjectContent/${date}?subjectName=${subjectName}`
        );
        setContents(response.data.content || []);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching contents:", error);
      }
    };

    fetchContents();
  }, [date, subjectName]);

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "Dashboard":
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 ">
            <DashboardItem
              icon={MdNotes}
              label="Notes"
              onClick={() => handleNavigation("Notes")}
              isActive={activeComponent === "Notes"}
            />
            <DashboardItem
              icon={MdMic}
              label="Voice"
              onClick={() => handleNavigation("Voice")}
              isActive={activeComponent === "Voice"}
            />
            <DashboardItem
              icon={MdCreditCard}
              label="Flashcards"
              onClick={() => handleNavigation("Flashcards")}
              isActive={activeComponent === "Flashcards"}
            />
            <DashboardItem
              icon={MdHelp}
              label="Quiz"
              onClick={() => handleNavigation("Quiz")}
              isActive={activeComponent === "Quiz"}
            />
          </div>
        );
      case "Notes":
        return <Notes imageData={imageData} />;
      case "Voice":
        return <Voice audioData={audioData} />;
      case "Flashcards":
        return <Flashcards imageData={imageData} />;
      case "Quiz":
        return <Quiz />;
      default:
        return <div>Select a component from the sidebar.</div>; // Default message
    }
  };
  const handleNavigation = (component) => {
    if (component === "Home") {
      navigate('/')
    };
    
    console.log("Navigating to:", component); // Debug log
    setActiveComponent(component);
  };

  const SidebarItem = ({ icon: Icon, label }) => (
    
    <button
      className={`flex gap-4 text-xl font-semibold items-center w-full p-2 rounded ${
        activeComponent === label
          ? "bg-blue-700 text-white"
          : "hover:bg-blue-800 hover:text-white"
      }`}
      onClick={() => handleNavigation(label)} // Ensure it calls the same handler
    >
      <Icon className="text-2xl" />
      {label}
    </button>
  );

  return (
    <div className="flex h-screen ">
      {/* Sidebar */}
      <div className="w-48 left-0 top-0 fixed flex-shrink-0 flex flex-col items-start justify-start py-4 space-y-4 px-2 h-full">
        <SidebarItem icon={MdHome} label="Home" />
        <SidebarItem icon={MdDashboard} label="Dashboard" />
        <SidebarItem icon={MdNotes} label="Notes" />
        <SidebarItem icon={MdMic} label="Voice" />
        <SidebarItem icon={MdCreditCard} label="Flashcards" />
        <SidebarItem icon={MdHelp} label="Quiz" />
      </div>

      {/* Main content */}
      <div className="flex-1 p-4">
       
          {/* Subject and Date Header */}
          <div className="bg-white rounded-lg ml-48 shadow-md p-4 mb-6 flex flex-col items-center">
          <h1 className="text-2xl font-bold text-blue-700">{subjectName.toUpperCase()}</h1>
          <div className="flex items-center mt-2">
            <span className="text-gray-600 text-lg">{month} {day}</span>
          </div>
        </div>
      
        <div className="max-w-4xl mx-auto px-8 flex-1">
          <Breadcrumbs
            subjectName={subjectName}
            activeComponent={activeComponent}
            onNavigate={handleNavigation}
          />
          <hr className="mt-2 mb-4"/>
          
          {renderActiveComponent()} {/* Ensure this is correctly positioned */}
        </div>
      </div>
    </div>
  );
}

export default Contents;
