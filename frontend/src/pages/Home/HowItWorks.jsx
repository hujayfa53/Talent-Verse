import React from 'react';
import Container from '../../components/Shared/Container';
import { FaUserPlus, FaLayerGroup, FaTrophy } from 'react-icons/fa';
import Heading from '../../components/Shared/Heading';

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      icon: FaUserPlus,
      title: "Sign Up",
      desc: "Join our community of talented creators and enthusiasts.",
      color: "bg-blue-100 text-blue-600"
    },
    {
      id: 2,
      icon: FaLayerGroup,
      title: "Participate",
      desc: "Browse active contests and submit your best work.",
      color: "bg-purple-100 text-purple-600"
    },
    {
      id: 3,
      icon: FaTrophy,
      title: "Win Prizes",
      desc: "Get voted as the winner and earn exciting rewards.",
      color: "bg-orange-100 text-orange-600"
    }
  ];

  return (
    <section className="py-10 md:py-16 bg-white dark:bg-gray-900 transition-colors">
      <Container>
        {/* Responsive Heading Margin */}
        <div className="mb-8 md:mb-12 text-center">
            <Heading title="How to Win" subtitle="Three simple steps to start your journey" center={true} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative mt-8 md:mt-16">
          {/* Connector Line (Desktop Only - positioned to hit center of icons) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-1 bg-gray-200 dark:bg-gray-700 -z-0 rounded-full"></div>

          {steps.map((step) => (
            <div key={step.id} className="relative z-10 flex flex-col items-center text-center">
              
              {/* Icon Circle - Responsive Size */}
              <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-2xl md:text-3xl mb-4 md:mb-6 shadow-lg ${step.color} border-4 border-white dark:border-gray-800 transition-transform hover:scale-110 duration-300`}>
                <step.icon />
              </div>
              
              {/* Title - Responsive Text */}
              <h3 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white mb-2">
                {step.title}
              </h3>
              
              {/* Description - Responsive Text */}
              <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-[250px] md:max-w-xs leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default HowItWorks;