import React, { useState, useEffect } from 'react';
import TaskCard from './task components/TaskCard';
import { supabase } from '../supabaseClient';

const TaskManager = () => {
  const [statusFilter, setStatusFilter] = useState('Active');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        console.error('User not logged in');
        setLoading(false);
        return;
      }

      try {
        // Step 1: Fetch Task IDs assigned to the logged-in user
        const { data: assignments, error: assignmentError } = await supabase
          .from('TaskAssignments')
          .select('task_id')
          .eq('user_id', user.id);

        if (assignmentError) {
          console.error('Error fetching task assignments:', assignmentError);
          setLoading(false);
          return;
        }

        const taskIds = assignments.map((assignment) => assignment.task_id);

        if (taskIds.length === 0) {
          // No tasks assigned to the user
          setTasks([]);
          setLoading(false);
          return;
        }

        // Step 2: Fetch tasks using the fetched task IDs
        const { data: tasksData, error: tasksError } = await supabase
          .from('Tasks')
          .select('*')
          .in('id', taskIds);

        if (tasksError) {
          console.error('Error fetching tasks:', tasksError);
          setTasks([]);
        } else {
          setTasks(tasksData);
        }
      } catch (err) {
        console.error('Unexpected error fetching tasks:', err);
        setTasks([]);
      }

      setLoading(false);
    };

    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter(task => task.status === statusFilter);

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-4 text-left">My Tasks</h2>
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setStatusFilter('Active')}
          className={`px-4 py-2 rounded-xl ${statusFilter === 'Active' ? 'bg-green-300 text-white' : 'bg-gray-200'} hover:bg-green-300 hover:text-white`}
        >
          Active
        </button>
        <button
          onClick={() => setStatusFilter('Snoozed')}
          className={`px-4 py-2 rounded-xl ${statusFilter === 'Snoozed' ? 'bg-orange-300 text-white' : 'bg-gray-200'} hover:bg-orange-300 hover:text-white`}
        >
          Snoozed
        </button>
        <button
          onClick={() => setStatusFilter('Completed')}
          className={`px-4 py-2 rounded-xl ${statusFilter === 'Completed' ? 'bg-blue-500 text-white' : 'bg-gray-200'} hover:bg-blue-500 hover:text-white`}
        >
          Completed
        </button>
      </div>
      <div className="overflow-x-auto">
        <div className="flex space-x-4">
          {loading ? (
            <p>Loading tasks...</p>
          ) : (
            filteredTasks.map(task => (
              <div key={task.id} className="flex-shrink-0 w-64">
                <TaskCard task={task} setTasks={setTasks} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskManager;