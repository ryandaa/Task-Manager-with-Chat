import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import Navbar from './components/Navbar';
import TaskManager from './components/TaskManager';
import TaskDetailPage from './components/task components/TaskDetailPage'; // Import TaskDetailPage
import About from './components/About';
import NewTaskButton from './components/task components/NewTaskButton';
import SignInPage from './components/SignInPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './index.css';

function App() {
    // State for storing the list of tasks and inputs for adding new tasks
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Active');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Fetch tasks when the user is logged in
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);

      // Fetch task assignments for the user
      const { data: assignments, error: assignmentsError } = await supabase
        .from('TaskAssignments')
        .select('task_id')
        .eq('user_id', user.id);

      if (assignmentsError) {
        console.error('Error fetching task assignments:', assignmentsError);
        setLoading(false);
        return;
      }

      // Extract task IDs from the assignments
      const taskIds = assignments.map(assignment => assignment.task_id);

      if (taskIds.length === 0) {
        setTasks([]);
        setLoading(false);
        return;
      }

      // Fetch tasks based on task IDs
      const { data: tasksData, error: tasksError } = await supabase
        .from('Tasks')
        .select('*')
        .in('id', taskIds);

      if (tasksError) {
        console.error('Error fetching tasks:', tasksError);
      } else {
        setTasks(tasksData);
      }

      setLoading(false);
    };

    if (user) {
      fetchTasks();
    }
  }, [user]);

  const addTask = async () => {
    const { data: newTask, error: taskError } = await supabase.from('Tasks').insert([
      { title, description, status },
    ]).single();
  
    if (taskError) {
      console.error('Error adding task:', taskError);
    } else {
      console.log('Task added:', newTask);
  
      // Insert the task assignment for the user
      const { error: assignmentError } = await supabase.from('TaskAssignments').insert([
        { user_id: user.id, task_id: newTask.id },
      ]);
  
      if (assignmentError) {
        console.error('Error assigning task:', assignmentError);
      } else {
        setTasks([...tasks, newTask]);
      }
    }
  
    // Reset the form fields after adding the task
    setTitle('');
    setDescription('');
    setStatus('Active');
  };

  if (!user) {
    return <SignInPage setUser={(user) => { setUser(user); window.location.href = '/task'; }} />;
  }

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/login"
          element={<SignInPage setUser={(user) => { setUser(user); window.location.href = '/task'; }} />}
        />
        <Route
          path="/task/:taskId"
          element={<TaskDetailPage user={user} />}
        />
        <Route
          path="/task"
          element={
            <div className="App min-h-screen">
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
          }
        />
        <Route path="/" element={<SignInPage setUser={(user) => setUser(user)} />} />
      </Routes>
    </Router>
  );
}

export default App;