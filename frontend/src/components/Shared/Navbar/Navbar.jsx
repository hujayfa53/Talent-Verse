import Container from "../Container";
import { AiOutlineMenu } from "react-icons/ai";
import { useState, useContext } from "react"; 
import { Link, NavLink } from "react-router"; 
import useAuth from "../../../hooks/useAuth";
import avatarImg from "../../../assets/images/placeholder.jpg";
import logo from "../../../assets/images/logo.png";
import { ThemeContext } from "../../../providers/ThemeProvider"; 
import { FaMoon, FaSun } from "react-icons/fa"; 

const Navbar = () => {
  const { user, logOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext); 

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "All Contests", path: "/all-contests" },
    { name: "FAQ", path: "/faq" },
    { name: "How It Works", path: "/how-it-works" },
  ];

  const DesktopNav = () => (
    <div className="hidden md:flex gap-6"> 
      {navLinks.map((link) => (
        <NavLink 
          key={link.name}
          to={link.path} 
          className={({ isActive }) => 
            isActive 
              ? "text-primary font-bold dark:text-accent border-b-2 border-primary dark:border-accent pb-1" 
              : "text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-accent font-medium transition-colors"
          }
        >
          {link.name}
        </NavLink>
      ))}
    </div>
  );

  return (
    <div className="fixed w-full bg-white/95 backdrop-blur-sm dark:bg-gray-900/95 z-50 shadow-sm transition-colors duration-300">
      <div className="py-3 border-b-[1px] dark:border-gray-700">
        <Container>
          <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="logo" className="w-8 h-8 md:w-10 md:h-10 object-contain" />
              <span className="text-xl font-bold text-primary dark:text-white hidden sm:block">
                Talent Verse
              </span>
            </Link>

            <DesktopNav />

            {/* Right Side: Toggle + Dropdown */}
            <div className="flex items-center gap-2 md:gap-4">
              
              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme} 
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-600 dark:text-gray-300"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? (
                  <FaSun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <FaMoon className="w-5 h-5" />
                )}
              </button>

              {/* User Menu / Dropdown */}
              <div className="relative">
                <div 
                  onClick={() => setIsOpen(!isOpen)}
                  className="p-2 md:py-1 md:px-2 border border-neutral-200 dark:border-gray-700 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition bg-white dark:bg-gray-800"
                >
                  <AiOutlineMenu className="dark:text-white" />
                  <div className="hidden md:block">
                    <img
                      className="rounded-full object-cover w-[30px] h-[30px]"
                      referrerPolicy="no-referrer"
                      src={user && user.photoURL ? user.photoURL : avatarImg}
                      alt="profile"
                    />
                  </div>
                </div>
                
                {/* Dropdown Content */}
                {isOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40 bg-transparent" 
                      onClick={() => setIsOpen(false)}
                    ></div>

                    <div className="absolute rounded-xl shadow-xl w-[75vw] md:w-[200px] bg-white dark:bg-gray-800 overflow-hidden right-0 top-12 text-sm border dark:border-gray-700 z-50 transform origin-top-right transition-all">
                      <div className="flex flex-col cursor-pointer">
                        
                        {/* --- Mobile Only Navigation --- */}
                        <div className="block md:hidden border-b dark:border-gray-700 pb-2 mb-2">
                           {navLinks.map((link) => (
                              <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className="block px-4 py-3 hover:bg-neutral-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold"
                              >
                                {link.name}
                              </Link>
                           ))}
                        </div>

                        {/* --- User Actions --- */}
                        {user ? (
                          <>
                            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 cursor-default border-b dark:border-gray-700">
                               <p className="font-bold text-primary dark:text-accent truncate">
                                 {user?.displayName || "User"}
                               </p>
                               <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                 {user?.email}
                               </p>
                            </div>

                            <Link
                              to="/dashboard"
                              onClick={() => setIsOpen(false)}
                              className="px-4 py-3 hover:bg-neutral-100 dark:hover:bg-gray-700 dark:text-white transition font-medium"
                            >
                              Dashboard
                            </Link>
                            <div
                              onClick={() => {
                                logOut();
                                setIsOpen(false);
                              }}
                              className="px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition font-medium cursor-pointer"
                            >
                              Logout
                            </div>
                          </>
                        ) : (
                          <>
                            <Link
                              to="/login"
                              onClick={() => setIsOpen(false)}
                              className="px-4 py-3 hover:bg-neutral-100 dark:hover:bg-gray-700 dark:text-white transition font-semibold"
                            >
                              Login
                            </Link>
                            <Link
                              to="/signup"
                              onClick={() => setIsOpen(false)}
                              className="px-4 py-3 hover:bg-neutral-100 dark:hover:bg-gray-700 dark:text-white transition font-semibold"
                            >
                              Sign Up
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Navbar;