import React, { useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import useRole from '../../../hooks/useRole';
import Banner from '../../../assets/images/banner.png'; // Ensure path is correct
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import UpdateProfileModal from '../../../components/Modal/UpdateProfileModal';

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const [role, isRoleLoading] = useRole();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Fetch User Stats for Chart
  const { data: stats = {}, isLoading: statsLoading, refetch } = useQuery({
    queryKey: ['user-stats', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/user-stats/${user?.email}`);
      return res.data;
    },
  });
  
  // 2. Fetch User Details (Address) from DB
  const { data: dbUser = {},refetch:refetchUser } = useQuery({
    queryKey: ['dbUser', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/${user?.email}`);
        return res.data;
    }
  });

  if (authLoading || isRoleLoading || statsLoading) return <LoadingSpinner />;

  // Chart Data Preparation
  const data = [
    { name: 'Wins', value: stats.winCount || 0 },
    { name: 'Participation', value: (stats.participationCount || 0) - (stats.winCount || 0) }, // Remaining participation
  ];
  
  const COLORS = ['#FF5E6C', '#2B2D6B']; // Your Brand Colors (Coral & Indigo)

  return (
    <div className='flex justify-center items-center py-12 bg-gray-50 min-h-screen'>
      <div className='bg-white shadow-2xl rounded-2xl md:w-4/5 lg:w-3/5 overflow-hidden'>
        
        {/* Banner Section */}
        <div className="relative">
             <img
              alt='cover photo'
              src={Banner}
              className='w-full h-56 object-cover'
            />
            {/* Role Badge */}
            <div className="absolute top-4 right-4">
                 <span className='px-4 py-2 text-xs font-bold text-white uppercase bg-secondary rounded-full shadow-lg'>
                    {role}
                 </span>
            </div>
        </div>

        {/* Profile Header */}
        <div className='flex flex-col items-center justify-center p-4 -mt-16 relative z-10'>
          <a href='#' className='relative block group'>
            <img
              alt='profile'
              src={user?.photoURL}
              className='mx-auto object-cover rounded-full h-32 w-32 border-4 border-white shadow-lg transition-transform group-hover:scale-105'
            />
          </a>

          <p className='mt-4 text-2xl font-bold text-[#2B2D6B]'>
            {user?.displayName}
          </p>
          <p className='text-sm text-gray-500'>ID: {user?.uid?.slice(0, 8)}...</p>
        </div>

        {/* Stats & Info Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 p-8'>
            
            {/* Left: User Info */}
            <div className="space-y-4">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">User Details</h3>
                    <div className="space-y-3">
                        <p className='flex justify-between text-sm'>
                            <span className="text-gray-500">Email:</span>
                            <span className='font-bold text-gray-700'>{user?.email}</span>
                        </p>
                        <p className='flex justify-between text-sm'>
                            <span className="text-gray-500">Address:</span>
                            <span className='font-bold text-gray-700'>{dbUser.address || "Not Set"}</span>
                        </p>
                         {/* Stats Summary Text */}
                        <div className="mt-4 pt-4 border-t">
                            <p className="flex justify-between text-sm">
                                <span className="text-gray-500">Total Participations:</span>
                                <span className="font-bold text-primary">{stats.participationCount}</span>
                            </p>
                            <p className="flex justify-between text-sm">
                                <span className="text-gray-500">Contests Won:</span>
                                <span className="font-bold text-accent">{stats.winCount}</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className='flex gap-4'>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className='flex-1 bg-secondary px-4 py-3 rounded-lg text-white font-medium hover:bg-[#25b5a8] transition shadow-md'
                    >
                    Update Profile
                    </button>
                    <button className='flex-1 bg-primary px-4 py-3 rounded-lg text-white font-medium hover:bg-[#202255] transition shadow-md'>
                    Change Password
                    </button>
                </div>
            </div>

            {/* Right: Win Percentage Chart */}
            <div className="flex flex-col items-center justify-center bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Success Rate</h3>
                
                {stats.participationCount > 0 ? (
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                        <p className="text-center font-bold text-2xl text-[#2B2D6B] -mt-8">
                            {stats.winPercentage}% Win Rate
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                        <p>No participation data yet.</p>
                        <p className="text-xs">Join a contest to see your stats!</p>
                    </div>
                )}
            </div>

        </div>
      </div>
      
      {/* Modal Injection */}
      <UpdateProfileModal 
        isOpen={isModalOpen} 
        closeModal={() => setIsModalOpen(false)} 
        refetch={() => {
            refetch(); // Reload stats
            // You might need a way to refetch dbUser here too if strict, but usually handled by query cache invalidation or page reload
        }}
      />
    </div>
  )
}

export default Profile;