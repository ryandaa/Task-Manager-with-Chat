import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const SignInPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSignIn = async () => {
    try {
      // Check if user already exists
      const { data: existingUser, error: fetchError } = await supabase
        .from('Users')
        .select('*')
        .eq('name', name)
        .eq('email', email)
        .single();

      if (fetchError && fetchError.code === 'PGRST116') {
        // User does not exist, so create a new user
        const { data: newUser, error: insertError } = await supabase
          .from('Users')
          .insert([{ name, email }])
          .single();

        if (insertError) {
          console.error('Error inserting new user:', insertError.message);
          return;
        }

        console.log('New user created:', newUser);

        // Wait for a moment to ensure the database entry is fully processed
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Refetch the user from the database to ensure it was created properly
        const { data: refetchedUser, error: refetchError } = await supabase
          .from('Users')
          .select('*')
          .eq('name', name)
          .eq('email', email)
          .single();

        if (refetchError) {
          console.error('Error refetching new user:', refetchError.message);
          return;
        }

        // Store user data and redirect
        localStorage.setItem('user', JSON.stringify(refetchedUser));
        window.location.href = '/task';

      } else if (existingUser) {
        // User found, proceed to save to local storage and navigate
        console.log('User found:', existingUser);
        localStorage.setItem('user', JSON.stringify(existingUser));
        window.location.href = '/task';
      } else if (fetchError) {
        console.error('Error fetching user:', fetchError.message);
      }
    } catch (error) {
      console.error('Unexpected error during sign-in:', error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Enter your name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Enter your email"
          />
        </div>
        <button
          onClick={handleSignIn}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

export default SignInPage;
