import React from 'react';
import { FaFacebook, FaLinkedin, FaTwitter } from 'react-icons/fa';
import Container from '../../../components/Shared/Container'; 
import { Link } from 'react-router';
import smallLogo from '../../../assets/images/smallLogo.png'

const Footer = () => {
  return (
    <footer className="bg-[#2B2D6B] text-white py-12 border-t border-white/10 mt-5">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0">
          
          {/* 1. Logo & Website Name */}
          <div className="flex items-center gap-3">
            {/* Placeholder Logo - Replace src with your actual logo file */}
            <img 
              src={smallLogo}
              alt="Talent Verse Logo" 
              className="w-10 h-10 object-contain  invert" 
            />
            <span className="text-2xl font-bold tracking-wide">
              Talent Verse
            </span>
          </div>

          {/* 2. Copyright Text */}
          <div className="text-gray-400 text-sm">
            Copyright © 2025 Talent Verse. All rights reserved.
          </div>

          {/* 3. Social Links */}
          <div className="flex gap-4">
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 bg-white/10 rounded-full hover:bg-[#FF5E6C] hover:text-white transition-all duration-300"
            >
              <FaFacebook size={20} />
            </a>
            
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 bg-white/10 rounded-full hover:bg-[#FF5E6C] hover:text-white transition-all duration-300"
            >
              <FaLinkedin size={20} />
            </a>
            
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 bg-white/10 rounded-full hover:bg-[#FF5E6C] hover:text-white transition-all duration-300"
            >
              <FaTwitter size={20} />
            </a>
          </div>

        </div>
      </Container>
    </footer>
  );
};

export default Footer;