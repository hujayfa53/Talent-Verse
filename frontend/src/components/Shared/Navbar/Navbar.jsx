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

  const links = (
    <div className="hidden md:flex gap-4"> 
      <NavLink 
        to="/" 
        className={({ isActive }) => isActive ? "text-primary font-bold dark:text-primary" : "text-black dark:text-white hover:text-gray-600"}
      >
        Home
      </NavLink>
      <NavLink 
        to="/all-contests" 
        className={({ isActive }) => isActive ? "text-primary font-bold dark:text-primary" : "text-black dark:text-white hover:text-gray-600"}
      >
        All Contests
      </NavLink>
      <NavLink 
        to="/leaderboard" 
        className={({ isActive }) => isActive ? "text-primary font-bold dark:text-primary" : "text-black dark:text-white hover:text-gray-600"}
      >
        Leaderboard
      </NavLink>
    </div>
  );

  return (
    <div className="fixed w-full bg-white dark:bg-gray-900 z-10 shadow-sm transition-colors duration-300">
      <div className="py-4 border-b-[1px] dark:border-gray-700">
        <Container>
          <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
            
            {/* Logo */}
            <Link to="/">
              <img src={logo} alt="logo" width="100" height="100" />
            </Link>

            {/* Middle Links */}
            {links}

            {/* Right Side: Toggle + Dropdown */}
            <div className="flex items-center gap-4">
              
              <button 
                onClick={toggleTheme} 
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                {theme === 'dark' ? (
                  <FaSun className="text-yellow-400 w-5 h-5" />
                ) : (
                  <FaMoon className="text-gray-600 w-5 h-5" />
                )}
              </button>

              {/* Dropdown Menu */}
              <div className="relative">
                <div className="flex flex-row items-center gap-3">
                  <div
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-4 md:py-1 md:px-2 border border-neutral-200 dark:border-gray-700 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition bg-white dark:bg-gray-800"
                  >
                    <AiOutlineMenu className="dark:text-white" />
                    <div className="hidden md:block">
                      <img
                        className="rounded-full"
                        referrerPolicy="no-referrer"
                        src={user && user.photoURL ? user.photoURL : avatarImg}
                        alt="profile"
                        height="30"
                        width="30"
                      />
                    </div>
                  </div>
                </div>
                
                {isOpen && (
                  <div className="absolute rounded-xl shadow-md w-[40vw] md:w-[15vw] bg-white dark:bg-gray-800 overflow-hidden right-0 top-12 text-sm border dark:border-gray-700">
                    <div className="flex flex-col cursor-pointer">
                      
                      {/* Mobile Home Link */}
                      <Link
                        to="/"
                        className="block md:hidden px-4 py-3 hover:bg-neutral-100 dark:hover:bg-gray-700 dark:text-white transition font-semibold"
                      >
                        Home
                      </Link>

                      {user ? (
                        <>
                          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 cursor-default border-b dark:border-gray-700">
                             <p className="font-bold text-gray-700 dark:text-gray-200 truncate">
                               {user?.displayName || "User"}
                             </p>
                          </div>

                          <Link
                            to="/dashboard"
                            className="px-4 py-3 hover:bg-neutral-100 dark:hover:bg-gray-700 dark:text-white transition font-semibold"
                          >
                            Dashboard
                          </Link>
                          <div
                            onClick={logOut}
                            className="px-4 py-3 hover:bg-neutral-100 dark:hover:bg-gray-700 dark:text-white transition font-semibold cursor-pointer"
                          >
                            Logout
                          </div>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/login"
                            className="px-4 py-3 hover:bg-neutral-100 transition font-semibold"
                          >
                            Login
                          </Link>
                          <Link
                            to="/signup"
                            className="px-4 py-3 hover:bg-neutral-100 transition font-semibold"
                          >
                            Sign Up
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
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