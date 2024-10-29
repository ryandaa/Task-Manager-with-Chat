import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

function App() {
  // State for storing the list of tasks and inputs for adding new tasks
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Active');
  const [loading, setLoading] = useState(true);

  // Fetch tasks when the component mounts
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('Tasks').select('*');
      
      if (error) {
        console.error('Error fetching tasks:', error);
      } else {
        setTasks(data);
      }
      setLoading(false);
    };

    fetchTasks();
  }, []);

  const addTask = async () => {
    const { data, error } = await supabase.from('Tasks').insert([
      { title, description, status },
    ]);
  
    if (error) {
      console.error('Error adding task:', error);
    } else {
      console.log('Task added:', data);
  
      // Check if data is not null and is an array before updating state
      if (Array.isArray(data) && data.length > 0) {
        setTasks([...tasks, ...data]);
      }
    }
  
    // Reset the form fields after adding the task
    setTitle('');
    setDescription('');
    setStatus('Active');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Task Manager with Supabase</h1>
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Task Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Active">Active</option>
            <option value="Snoozed">Snoozed</option>
            <option value="Completed">Completed</option>
          </select>
          <button onClick={addTask}>Add Task</button>
        </div>

        {loading ? (
          <p>Loading tasks...</p>
        ) : (
          <div>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <div key={task.id} style={{ marginBottom: '20px' }}>
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <p>Status: {task.status}</p>
                </div>
              ))
            ) : (
              <p>No tasks available</p>
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;