import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import Navbar from './components/Navbar';
import TaskManager from './components/TaskManager';
import About from './components/About';
import NewTaskButton from './components/NewTaskButton';
import './App.css';
import './index.css';

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
    <div className="App min-h-screen">
      <Navbar />
      <TaskManager
        tasks={tasks}
        loading={loading}
        title={title}
        description={description}
        status={status}
        setTitle={setTitle}
        setDescription={setDescription}
        setStatus={setStatus}
        addTask={addTask}
      />
      <About />
      <NewTaskButton />
    </div>
  );
}

export default App;
