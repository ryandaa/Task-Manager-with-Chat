import React, { useState, useEffect, useRef } from 'react';

const TaskCard = ({ task }) => {
  const [showMenu, setShowMenu] = useState(false);
  const cardRef = useRef(null);

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const handleClickOutside = (event) => {
    if (cardRef.current && !cardRef.current.contains(event.target)) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getStatusColor = () => {
    switch (task.status) {
      case 'Active':
        return 'bg-green-200';
      case 'Snoozed':
        return 'bg-orange-200';
      case 'Completed':
        return 'bg-blue-500';
      default:
        return 'bg-gray-200';
    }
  };

  return (
    <div ref={cardRef} className="p-4 mb-4 border rounded-2xl shadow relative">
      <div className="absolute top-2 right-2">
        <button onClick={handleMenuToggle} className="text-gray-500">⋮</button>
        {showMenu && (
          <div className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg">
            <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Edit</button>
            <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Delete</button>
          </div>
        )}
      </div>
      <h3 className="font-bold mb-2">{task.title}</h3>
      <p>Status: {task.status}</p>
      <div className={`h-[10%] w-full absolute bottom-0 left-0 rounded-b-2xl ${getStatusColor()}`}></div>
    </div>
  );
};

export default TaskCard;
