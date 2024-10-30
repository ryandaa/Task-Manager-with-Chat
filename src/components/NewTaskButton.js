import React from 'react';

const NewTaskButton = () => {
  return (
    <button
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-11/12 md:w-3/4 bg-gradient-to-r from-blue-600 to-purple-400 text-white text-2xl p-4 rounded-full shadow-lg"
      onClick={() => console.log('Navigate to New Task Form')}
    >
      New Task
    </button>
  );
};

export default NewTaskButton;
