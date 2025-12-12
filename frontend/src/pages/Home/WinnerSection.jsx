import React from 'react';
import Container from '../../components/Shared/Container';
import { motion } from 'framer-motion'; 

const WinnerSection = () => {
  // Mock Data for 3 Winners
  const winners = [
    {
      id: 1,
      name: "Sarah Jenkins",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      contest: "Designer’s Playground",
      prize: "$2,500",
      quote: "I never thought my balcony garden would win big!",
    },
    {
      id: 2,
      name: "Michael Chen",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      contest: "SnapSpark Challenge",
      prize: "$1,800",
      quote: "Participating was fun, winning was life-changing.",
    },
    {
      id: 3,
      name: "Emma Wilson",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      contest: "Insight Writers Arena",
      prize: "$3,200",
      quote: "The community support here is incredible.",
    },
  ];

  return (
    <div className="bg-[#2B2D6B] py-20 relative overflow-hidden font-sans">
      {/* Decorative background circle */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#2FD6C7] opacity-10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      
      <Container>
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-[#2FD6C7] font-semibold tracking-wider uppercase text-sm">
            Wall of Fame
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Meet Our Recent <span className="text-[#FF5E6C]">Champions</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg font-light">
            Talent meets opportunity. These creators turned their passion into prizes. 
            <br className="hidden md:block"/> Are you next?
          </p>
        </div>

        {/* Winners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {winners.map((winner) => (
            <div 
              key={winner.id} 
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:transform hover:-translate-y-2 transition-all duration-300 shadow-xl group"
            >
              <div className="flex flex-col items-center text-center">
                
                {/* Image Wrapper */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#FF5E6C] to-[#2FD6C7] rounded-full p-1">
                     <img 
                        src={winner.image} 
                        alt={winner.name} 
                        className="w-24 h-24 rounded-full object-cover border-4 border-[#2B2D6B]" 
                     />
                  </div>
                  {/* Crown Icon Badge */}
                  <div className="absolute -top-2 -right-2 bg-[#FF5E6C] text-white p-2 rounded-full shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-1">
                  {winner.name}
                </h3>
                <p className="text-[#2FD6C7] text-sm font-medium mb-4 uppercase tracking-wide">
                  Winner: {winner.contest}
                </p>
                
                <p className="text-gray-300 italic text-sm mb-6 px-4">
                  "{winner.quote}"
                </p>

                {/* Prize Tag */}
                <div className="w-full bg-[#2B2D6B] rounded-xl py-3 border border-[#2FD6C7]/30 group-hover:border-[#FF5E6C] transition-colors">
                  <p className="text-gray-400 text-xs uppercase mb-1">Total Prize Won</p>
                  <p className="text-2xl font-extrabold text-[#FF5E6C]">
                    {winner.prize}
                  </p>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <p className="text-white text-lg mb-6">Ready to claim your victory?</p>
          <button className="px-10 py-4 bg-gradient-to-r from-[#FF5E6C] to-[#FF8F7D] text-white font-bold rounded-full shadow-lg hover:shadow-[#FF5E6C]/40 transform hover:scale-105 transition-all duration-300">
            Join A Contest Now
          </button>
        </div>

      </Container>
    </div>
  );
};

export default WinnerSection;