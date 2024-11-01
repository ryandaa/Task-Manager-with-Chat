import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { useParams } from 'react-router-dom';

const TaskDetailPage = () => {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [view, setView] = useState('chat');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchTaskDetails = async () => {
      const { data, error } = await supabase
        .from('Tasks')
        .select('*')
        .eq('id', taskId)
        .single();

      if (error) {
        console.error('Error fetching task details:', error);
      } else {
        setTask(data);
      }
    };

    const fetchMessages = async () => {
      const { data: messagesData, error: messagesError } = await supabase
        .from('TaskMessages')
        .select('*')
        .eq('task_id', taskId)
        .order('timestamp', { ascending: true });

      if (messagesError) {
        console.error('Error fetching messages:', messagesError);
        return;
      }

      // Fetch user details for each message
      const userIds = [...new Set(messagesData.map((msg) => msg.user_id))];
      const { data: usersData, error: usersError } = await supabase
        .from('Users')
        .select('id, name')
        .in('id', userIds);

      if (usersError) {
        console.error('Error fetching users:', usersError);
        return;
      }

      // Map user names to messages
      const usersMap = usersData.reduce((acc, user) => {
        acc[user.id] = user.name;
        return acc;
      }, {});

      const messagesWithUserNames = messagesData.map((msg) => ({
        ...msg,
        user_name: usersMap[msg.user_id] || 'Unknown User',
      }));

      setMessages(messagesWithUserNames);
    };

    fetchTaskDetails();
    fetchMessages();
  }, [taskId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    const { error } = await supabase
      .from('TaskMessages')
      .insert([
        { user_id: user.id, task_id: taskId, message: newMessage },
      ]);

    if (error) {
      console.error('Error sending message:', error);
    } else {
      setNewMessage('');
      fetchMessages();
    }
  };

  // Function to refetch messages
  const fetchMessages = async () => {
    const { data: messagesData, error: messagesError } = await supabase
      .from('TaskMessages')
      .select('*')
      .eq('task_id', taskId)
      .order('timestamp', { ascending: true });

    if (messagesError) {
      console.error('Error fetching messages:', messagesError);
      return;
    }

    const userIds = [...new Set(messagesData.map((msg) => msg.user_id))];
    const { data: usersData, error: usersError } = await supabase
      .from('Users')
      .select('id, name')
      .in('id', userIds);

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return;
    }

    const usersMap = usersData.reduce((acc, user) => {
      acc[user.id] = user.name;
      return acc;
    }, {});

    const messagesWithUserNames = messagesData.map((msg) => ({
      ...msg,
      user_name: usersMap[msg.user_id] || 'Unknown User',
    }));

    setMessages(messagesWithUserNames);
  };

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;

    const { error } = await supabase
      .from('Tasks')
      .update({ status: newStatus })
      .eq('id', taskId);

    if (error) {
      console.error('Error updating task status:', error);
    } else {
      setTask((prevTask) => ({ ...prevTask, status: newStatus }));
    }
  };

  return (
    <div className="min-h-screen">
      <div className="p-4">
        {task && (
          <div className="mb-4 p-4 border rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-2">{task.title}</h2>
          </div>
        )}
        <div className="flex space-x-4 mb-4">
          <button
            className={`px-4 py-2 ${view === 'chat' ? 'bg-blue-500 text-white' : 'bg-gray-300'} rounded`}
            onClick={() => setView('chat')}
          >
            Chat
          </button>
          <button
            className={`px-4 py-2 ${view === 'split' ? 'bg-blue-500 text-white' : 'bg-gray-300'} rounded`}
            onClick={() => setView('split')}
          >
            Task Details
          </button>
        </div>

        {/* Split View (Task Details + Chat) */}
        {view === 'split' && (
          <>
            {task && (
              <div className="bg-white p-4 rounded-lg shadow mb-4">
                <h3 className="text-lg font-bold mb-2">Task Details</h3>
                <p>{task.description}</p>
                <p className="mt-2 font-semibold">
                  Budget: {task.budget ? `$${task.budget}` : 'N/A'}
                </p>
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1">Status:</label>
                  <select
                    value={task.status}
                    onChange={handleStatusChange}
                    className="w-full border p-2 rounded"
                  >
                    <option value="Active">Active</option>
                    <option value="Snoozed">Snoozed</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
            )}
            <div className="bg-white p-4 rounded-lg shadow mb-4">
              <h3 className="text-lg font-bold mb-2">Chat</h3>
              <div className="h-64 overflow-y-auto mb-4 border p-2">
                {messages.length > 0 ? (
                  messages.map((message) => (
                    <div key={message.id} className="mb-2">
                      <strong>{message.user_id === user.id ? 'Me' : message.user_name}:</strong> {message.message}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No messages yet. Start the conversation!</p>
                )}
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-grow border p-2 rounded-l"
                  placeholder="Type your message..."
                />
                <button onClick={handleSendMessage} className="bg-blue-500 text-white p-2 rounded-r">
                  Send
                </button>
              </div>
            </div>
          </>
        )}

        {/* Chat Only View */}
        {view === 'chat' && (
          <div className="bg-white p-4 rounded-lg shadow mb-4">
            <h3 className="text-lg font-bold mb-2">Chat</h3>
            <div className="h-64 overflow-y-auto mb-4 border p-2">
              {messages.length > 0 ? (
                messages.map((message) => (
                  <div key={message.id} className="mb-2">
                    <strong>{message.user_id === user.id ? 'Me' : message.user_name}:</strong> {message.message}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No messages yet. Start the conversation!</p>
              )}
            </div>
            <div className="flex">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-grow border p-2 rounded-l"
                placeholder="Type your message..."
              />
              <button onClick={handleSendMessage} className="bg-blue-500 text-white p-2 rounded-r">
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetailPage;