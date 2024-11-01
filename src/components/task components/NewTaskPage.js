import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { createClient } from '@supabase/supabase-js';

Modal.setAppElement(document.getElementById('root') || document.body); // Set the root element for accessibility

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const NewTaskPage = ({ isOpen, onClose, setTasks = () => {} }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskStatus, setTaskStatus] = useState('Active');
  const [budget, setBudget] = useState('');
  const [pdfFile, setPdfFile] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setTaskTitle('');
      setTaskDescription('');
      setTaskStatus('Active');
      setBudget('');
      setPdfFile(null);
    }
  }, [isOpen]);

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    try {
      // Retrieve the logged-in user from local storage
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        console.error('User not logged in');
        return;
      }
  
      // Insert new task into the Tasks table
      const { data: taskData, error: taskError } = await supabase
        .from('Tasks')
        .insert([{
          title: taskTitle,
          description: taskDescription,
          status: taskStatus,
          budget: budget ? parseFloat(budget) : null,
          pdf_file_name: pdfFile ? pdfFile.name : null,
        }])
        .select();  // Use .select() to get the inserted data
  
      if (taskError) {
        console.error('Error uploading task:', taskError.message);
        return;
      }
  
      if (!taskData || !Array.isArray(taskData) || taskData.length === 0) {
        console.error('No task data returned');
        return;
      }
  
      console.log('Task uploaded successfully:', taskData);
      const taskId = taskData[0].id;
      const userId = user.id;
  
      // Assign task to user by inserting into TaskAssignments
      const { error: assignmentError } = await supabase
        .from('TaskAssignments')
        .insert([{ user_id: userId, task_id: taskId }]);
  
      if (assignmentError) {
        console.error('Error assigning task to user:', assignmentError.message);
        return;
      }
  
      console.log('Task assigned to user successfully');
      
      // Set the tasks in the state to update the UI
      setTasks((prevTasks) => [...prevTasks, ...taskData]);

      // Refresh the page to reflect the new task card
      window.location.reload();

    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };

  return (
    <Modal
      isOpen={isOpen} ariaHideApp={false}
      onRequestClose={onClose}
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative z-60"
      contentLabel="Create New Task"
      shouldCloseOnOverlayClick={true} // Ensure modal closes properly when clicking outside
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 rounded-full p-1 z-70"
        aria-label="Close"
      >
        &times;
      </button>
      <h2 className="text-xl font-bold mb-4">Create New Task</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Task Title</label>
        <input
          type="text"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          className={"w-full border p-2 rounded"}
          placeholder="Enter task title"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Task Description</label>
        <textarea
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          className={"w-full border p-2 rounded h-24"}
          placeholder="Enter task description"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          value={taskStatus}
          onChange={(e) => setTaskStatus(e.target.value)}
          className={"w-full border p-2 rounded"}
        >
          <option value="Active">Active</option>
          <option value="Snoozed">Snoozed</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Budget (Optional)</label>
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className={"w-full border p-2 rounded"}
          placeholder="Optional Budget"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Upload PDF (Optional)</label>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className={"w-full p-2"}
        />
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className={"bg-blue-500 text-white p-2 rounded hover:bg-blue-600"}
        >
          Create Task
        </button>
      </div>
    </Modal>
  );
};

export default NewTaskPage;