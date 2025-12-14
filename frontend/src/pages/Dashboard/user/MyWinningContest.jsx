import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';
import Heading from '../../../components/Shared/Heading';
import { useNavigate } from 'react-router';

const MyWinningContests = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  //  Fetch Winning Data
  const { data: winnings = [], isLoading } = useQuery({
    queryKey: ['my-winning-contests', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/my-winning-contests/${user?.email}`);
      return res.data;
    },
  });

  //  Calculate Total Prize Money
  const totalPrize = winnings.reduce((sum, item) => sum + Number(item.prize), 0);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Heading title="My Trophy Room" subtitle="Celebrating your hard-earned victories!" />

      {/*  STATS CARD */}
      {winnings.length > 0 && (
        <div className="bg-[#2B2D6B] rounded-2xl p-8 mb-10 text-center shadow-2xl relative overflow-hidden max-w-2xl mx-auto">
           {/* Background Decoration */}
           <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF5E6C] opacity-20 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
           
           <h3 className="text-[#2FD6C7] text-lg font-bold uppercase tracking-widest mb-2">
             Total Winnings
           </h3>
           <p className="text-5xl md:text-6xl font-extrabold text-white">
             ${totalPrize}
           </p>
           <p className="text-gray-300 mt-4">
             You have won <span className="font-bold text-white">{winnings.length}</span> contests!
           </p>
        </div>
      )}

      {/* --- WINNINGS GRID --- */}
      {winnings.length === 0 ? (
        <div className="text-center mt-20">
            <p className="text-2xl text-gray-500 font-bold">No wins yet...</p>
            <p className="text-gray-400">Keep participating to fill your trophy room!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {winnings.map((contest) => (
            <div 
              key={contest._id} 
              className="relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-yellow-400"
            >
              {/* Gold Ribbon Badge */}
              <div className="absolute top-0 right-0">
                <div className="w-32 h-8 absolute top-4 -right-8">
                  <div className="h-full w-full bg-yellow-400 text-white text-xs font-bold flex items-center justify-center transform rotate-45 shadow-sm">
                    WINNER
                  </div>
                </div>
              </div>

              {/* Image */}
              <figure className="h-48 overflow-hidden">
                <img 
                  src={contest.image} 
                  alt={contest.name} 
                  className="w-full h-full object-cover" 
                />
              </figure>

              {/* Body */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#2B2D6B] mb-2">{contest.name}</h3>
                <p className="text-gray-500 text-sm mb-4">
                   Category: <span className="font-medium text-gray-700">{contest.category}</span>
                </p>
                
                <div className="flex justify-between items-end border-t pt-4">
                   <div>
                      <p className="text-xs text-gray-400 uppercase">Prize Won</p>
                      <p className="text-2xl font-bold text-[#FF5E6C]">${contest.prize}</p>
                   </div>
                   
                   <button 
                     onClick={() => navigate(`/plant/${contest._id}`)}
                     className="px-4 py-2 bg-[#2FD6C7] hover:bg-[#25b5a8] text-white font-bold rounded-lg text-sm transition-colors"
                   >
                     View Contest
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyWinningContests;