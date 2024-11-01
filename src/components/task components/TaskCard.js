import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../supabaseClient';

const TaskCard = ({ task, setTasks }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedTask, setEditedTask] = useState({ title: task.title, description: task.description, status: task.status });
  const cardRef = useRef(null);

  const handleMenuToggle = (event) => {
    event.stopPropagation(); // Prevents handleCardClick from firing
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
        return 'bg-green-300';
      case 'Snoozed':
        return 'bg-orange-300';
      case 'Completed':
        return 'bg-blue-500';
      default:
        return 'bg-gray-200';
    }
  };

  const handleCardClick = () => {
    if (!showMenu) {
      window.location.href = `/task/${task.id}`;
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation(); // Prevent handleCardClick when clicking on menu options
    setShowEditModal(true);
  };

  const handleEditSubmit = async () => {
    const { data, error } = await supabase
      .from('Tasks')
      .update({
        title: editedTask.title,
        description: editedTask.description,
        status: editedTask.status,
      })
      .eq('id', task.id)
      .select();

    if (error) {
      console.error('Error updating task:', error);
    } else {
      if (data && data.length > 0) {
        // Update the local state using setTasks to reflect the changes
        setTasks((prevTasks) => prevTasks.map((t) => (t.id === task.id ? data[0] : t)));
      } else {
        console.warn('No data returned from update');
      }
      setShowEditModal(false);
    }
  };

  const handleDeleteClick = async (e) => {
    e.stopPropagation(); // Prevent handleCardClick when clicking on menu options
    const { error } = await supabase
      .from('Tasks')
      .delete()
      .eq('id', task.id);

    if (error) {
      console.error('Error deleting task:', error);
    } else {
      // Update the tasks state to remove the deleted task
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== task.id));
    }
  };

  return (
    <div
      ref={cardRef}
      className="p-4 mb-4 border rounded-2xl shadow relative z-20 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="absolute top-2 right-2 z-30">
        <button onClick={handleMenuToggle} className="text-gray-500">⋮</button>
        {showMenu && (
          <div className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg z-40">
            <button
              onClick={handleEditClick}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Edit
            </button>
            <button
              onClick={handleDeleteClick}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Delete
            </button>
          </div>
        )}
      </div>
      <h3 className="font-bold mb-6">{task.title}</h3>
      <div className={`h-[25%] w-full absolute bottom-0 left-0 rounded-b-2xl ${getStatusColor()} flex items-center`}>
        <p className="ml-4 text-sm text-white">{task.status}</p>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Task</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={editedTask.title}
                onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={editedTask.description}
                onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                className="w-full border p-2 rounded h-24"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={editedTask.status}
                onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value })}
                className="w-full border p-2 rounded"
              >
                <option value="Active">Active</option>
                <option value="Snoozed">Snoozed</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowEditModal(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;