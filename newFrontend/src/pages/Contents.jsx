import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MdHome, MdNotes, MdMic, MdHelp, MdCreditCard, MdChevronRight } from 'react-icons/md';
import Notes from '../components/Notes';

// Placeholder components for each section

const Voice = () => <div>Voice Component</div>;
const Flashcards = () => <div>Flashcards Component</div>;
const Quiz = () => <div>Quiz Component</div>;

const DashboardItem = ({ icon: Icon, label, onClick, isActive }) => (
  <button 
    className={`bg-gray-100 p-4 rounded-lg flex flex-col items-center justify-center space-y-2 ${isActive ? 'ring-2 ring-blue-500' : ''}`}
    onClick={onClick}
  >
    <Icon className={`w-6 h-6 ${isActive ? 'text-blue-500' : ''}`} />
    <span className={isActive ? 'text-blue-500' : ''}>{label}</span>
  </button>
);

const Breadcrumbs = ({ subjectName, activeComponent, onNavigate }) => (
  <nav className="flex" aria-label="Breadcrumb">
    <ol className="inline-flex items-center space-x-1 md:space-x-3">
      <li className="inline-flex items-center">
        <button onClick={() => onNavigate('Home')} className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
          <MdHome className="mr-2 w-4 h-4" />
          Home
        </button>
      </li>
      {activeComponent && activeComponent !== 'Home' && (
        <li>
          <div className="flex items-center">
            <MdChevronRight className="w-6 h-6 text-gray-400" />
            <span className="ml-1 text-sm font-medium text-gray-700">{activeComponent}</span>
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
  const [activeComponent, setActiveComponent] = useState('Home');
  const currentDate = new Date();
  const month = currentDate.toLocaleString('default', { month: 'long' });
  const day = currentDate.getDate();

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

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case 'Home':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <DashboardItem 
              icon={MdNotes} 
              label="Notes" 
              onClick={() => handleNavigation('Notes')}
              isActive={false}
            />
            <DashboardItem 
              icon={MdMic} 
              label="Voice" 
              onClick={() => handleNavigation('Voice')}
              isActive={false}
            />
            <DashboardItem 
              icon={MdCreditCard} 
              label="Flashcards" 
              onClick={() => handleNavigation('Flashcards')}
              isActive={false}
            />
            <DashboardItem 
              icon={MdHelp} 
              label="Quiz" 
              onClick={() => handleNavigation('Quiz')}
              isActive={false}
            />
          </div>
        );
      case 'Notes':
        return <Notes contents={contents} />;
      case 'Voice':
        return <Voice />;
      case 'Flashcards':
        return <Flashcards />;
      case 'Quiz':
        return <Quiz />;
      default:
        return null;
    }
  };

  const handleNavigation = (component) => {
    setActiveComponent(component);
    // If you need to update the URL, you can use navigate here
    // navigate(`/${subjectName}/${component.toLowerCase()}`);
  };

  const SidebarItem = ({ icon: Icon, label }) => (
    <button
      className={`flex gap-4 text-xl font-semibold items-center w-full p-2 rounded ${activeComponent === label ? 'bg-blue-700 text-white' : 'text-white hover:bg-blue-800'}`}
      onClick={() => handleNavigation(label)}
    >
      <Icon className="text-2xl" />
      {label}
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
    
      <div className="w-64 bg-blue-900 text-white flex flex-col items-start justify-start py-4 space-y-4 px-2">
        <SidebarItem icon={MdHome} label="Home" />
        <SidebarItem icon={MdNotes} label="Notes" />
        <SidebarItem icon={MdMic} label="Voice" />
        <SidebarItem icon={MdCreditCard} label="Flashcards" />
        <SidebarItem icon={MdHelp} label="Quiz" />
      </div>

      {/* Main content */}
      <div className="flex-1">
      <h1 className='text-xl font-bold text-center'>{subjectName}</h1>
        <div className="max-w-4xl mx-auto p-8">
          <Breadcrumbs 
            subjectName={subjectName} 
            activeComponent={activeComponent} 
            onNavigate={handleNavigation}
          />

          <div className="flex justify-end space-x-4 mb-8 mt-4">
            <div className="bg-white border border-gray-200 rounded px-4 py-2">{month}</div>
            <div className="bg-white border border-gray-200 rounded px-4 py-2">{day}</div>
          </div>

          {renderActiveComponent()}
        </div>
      </div>
    </div>
  );
}

export default Contents;