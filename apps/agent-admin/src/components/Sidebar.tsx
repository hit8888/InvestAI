import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // NEED TO CHANGE THE UI AS PER THE FIGMA DESIGN REQUIREMENT
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div
        style={{
          width: isOpen ? '200px' : '50px',
          transition: 'width 0.3s',
          backgroundColor: '#333',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '10px 0',
        }}
      >
        <button
          onClick={toggleSidebar}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: '#fff',
            marginBottom: '20px',
            cursor: 'pointer',
            fontSize: '18px',
          }}
        >
          {isOpen ? '←' : '☰'}
        </button>
        <NavLink
          to="/leads"
          className={'cursor-pointer'}
          style={({ isActive }) => ({
            color: isActive ? 'yellow' : '#fff',
            textDecoration: 'none',
            padding: '10px 20px',
            display: 'block',
            textAlign: 'center',
          })}
        >
          Leads
        </NavLink>
        <NavLink
          to="/conversations"
          style={({ isActive }) => ({
            color: isActive ? 'yellow' : '#fff',
            textDecoration: 'none',
            padding: '10px 20px',
            display: 'block',
            textAlign: 'center',
          })}
        >
          Conversations
        </NavLink>
        <NavLink
          to="/playground"
          style={({ isActive }) => ({
            color: isActive ? 'yellow' : '#fff',
            textDecoration: 'none',
            padding: '10px 20px',
            display: 'block',
            textAlign: 'center',
          })}
        >
          Playground
        </NavLink>
        <div style={{ flex: 1, padding: '20px' }}>
          <h1>Welcome</h1>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
