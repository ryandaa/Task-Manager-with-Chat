import React, { useState } from 'react';
import NewTaskPage from './NewTaskPage';

const NewTaskButton = () => {
  const [showNewTaskPage, setShowNewTaskPage] = useState(false);

  const handleOpenNewTaskPage = () => {
    setShowNewTaskPage(true);
  };

  const handleCloseNewTaskPage = () => {
    setShowNewTaskPage(false);
  };

  return (
    <>
      <button
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-11/12 md:w-3/4 bg-gradient-to-r from-blue-600 to-purple-400 text-white text-2xl p-4 rounded-full shadow-lg"
        onClick={handleOpenNewTaskPage}
      >
        New Task
      </button>
      {showNewTaskPage && (
        <div className="fixed inset-0 bg-white z-50 p-4">
          <NewTaskPage isOpen={true} onClose={handleCloseNewTaskPage} />
        </div>
      )}
    </>
  );
};

export default NewTaskButton;