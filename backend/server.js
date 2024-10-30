// Setting up your backend functions is an essential part of building your app. Since you're using Node.js and Express for the backend, let me guide you on how to create these API endpoints step-by-step. I'll also explain what each one does and how you can implement them.

// First, set up Express if you haven't already:

// Run the following command to install Express:
// npm install express

// Create a file named 'server.js' or 'index.js' to set up your server.

const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Supabase setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware to parse JSON requests
app.use(express.json());

// Middleware to log every request
app.use((req, res, next) => {
  console.log(`Received ${req.method} request for '${req.url}'`);
  next();
});

// 1. Task CRUD Operations

// a. Create a new Task
app.post('/tasks', async (req, res) => {
  const { title, description, status } = req.body;
  const { data, error } = await supabase.from('Tasks').insert([{ title, description, status, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(201).json({ task: data });
});

// b. Read all Tasks
app.get('/tasks', async (req, res) => {
  const { data, error } = await supabase.from('Tasks').select('*');

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(200).json({ tasks: data });
});

// c. Get a single Task by ID
app.get('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('Tasks').select('*').eq('id', id).single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  if (!data) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.status(200).json({ task: data });
});

// d. Update a Task
app.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;
  const { data, error } = await supabase.from('Tasks').update({ title, description, status, updated_at: new Date().toISOString() }).eq('id', id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(200).json({ task: data });
});

// e. Delete a Task
app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('Tasks').delete().eq('id', id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(200).json({ message: 'Task deleted successfully' });
});

// 2. Fetching Task Messages
app.get('/tasks/:taskId/messages', async (req, res) => {
  const { taskId } = req.params;
  const { data, error } = await supabase.from('TaskMessages').select('*').eq('task_id', taskId);

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(200).json({ messages: data });
});

// 3. Creating New Messages
app.post('/tasks/:taskId/messages', async (req, res) => {
  const { taskId } = req.params;
  const { userId, message } = req.body;
  const { data, error } = await supabase.from('TaskMessages').insert([{ task_id: taskId, user_id: userId, message }]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(201).json({ message: data });
});

// 4. Updating Task Status
app.patch('/tasks/:id/status', async (req, res) => {
  console.log(`PATCH request received for task ID: ${req.params.id}`);
  console.log(`Request body:`, req.body);

  const { id } = req.params;
  const { status } = req.body;
  console.log(`Status value received:`, status);

  // Check if status is provided
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  // Update the task status
  const { data, error } = await supabase
    .from('Tasks')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);

  // Handle potential errors from Supabase
  if (error) {
    console.error('Error updating task status:', error.message);
    return res.status(500).json({ error: error.message });
  }

  // Handle case when no task was updated (i.e., task not found)
  if (!data || data.length === 0) {
    return res.status(404).json({ error: 'Task not found' });
  }

  // Success response
  res.status(200).json({ task: data[0] });
});

// 5. Task Assignment Management
// Assign a user to a task
app.post('/tasks/:taskId/assign', async (req, res) => {
  const { taskId } = req.params;
  const { userId } = req.body;
  const { data, error } = await supabase.from('TaskAssignments').insert([{ task_id: taskId, user_id: userId }]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(201).json({ assignment: data });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// ### Explanation ###
// - **Task CRUD Operations**: These endpoints allow you to create, read, update, and delete tasks.
// - **Fetching Task Messages**: This endpoint (`GET /tasks/:taskId/messages`) fetches all messages related to a specific task.
// - **Creating New Messages**: This endpoint (`POST /tasks/:taskId/messages`) allows users to add messages to specific tasks.
// - **Updating Task Status**: (`PATCH /tasks/:id/status`) allows you to change the status of a task (e.g., Active, Snoozed, Completed).
// - **Task Assignment Management**: (`POST /tasks/:taskId/assign`) assigns a specific user to a task, storing it in the `TaskAssignments` table.
