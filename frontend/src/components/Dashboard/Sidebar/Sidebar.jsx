import { useState } from "react";
import { Link } from "react-router";
import useAuth from "../../../hooks/useAuth";
import logo from "../../../assets/images/logo.png";
import { GrLogout } from "react-icons/gr";
import { FcSettings } from "react-icons/fc";
import { AiOutlineBars } from "react-icons/ai";
import MenuItem from "./Menu/MenuItem";
import AdminMenu from "./Menu/AdminMenu";
import CreatorMenu from "./Menu/CreatorMenu";
import UserMenu from "./Menu/UserMenu";
import useRole from "../../../hooks/useRole";
import LoadingSpinner from "../../Shared/LoadingSpinner";

const Sidebar = () => {
  const { logOut } = useAuth();
  const [isActive, setActive] = useState(false);
  const [role, isRoleLoading] = useRole();

  const handleToggle = () => {
    setActive(!isActive);
  };

  const closeSidebar = () => {
    setActive(false);
  };

  if (isRoleLoading) return <LoadingSpinner />;

  return (
    <>
      {/* Small Screen Navbar */}
      <div className="bg-gray-100 text-gray-800 flex justify-between md:hidden sticky top-0 z-50 shadow-sm">
        <div>
          <div className="block cursor-pointer p-4 font-bold">
            <Link to="/">
              <img src={logo} alt="logo" width="50" height="50" />
            </Link>
          </div>
        </div>

        <button
          onClick={handleToggle}
          className="mobile-menu-button p-4 focus:outline-none focus:bg-gray-200"
        >
          <AiOutlineBars className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile Overlay */}
      {isActive && (
        <div 
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden transition-opacity"
        ></div>
      )}

      {/* Sidebar Container */}
      <div
        className={`z-50 md:fixed flex flex-col justify-between overflow-x-hidden bg-gray-100 w-64 space-y-6 px-2 py-4 absolute inset-y-0 left-0 transform transition-transform duration-300 ease-in-out ${
          isActive ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 h-full border-r border-gray-200`}
      >
        <div className="flex flex-col h-full">
          {/* Top Content: Logo */}
          <div>
            <div className="w-full hidden md:flex px-4 py-2 shadow-sm rounded-lg justify-center items-center bg-white mx-auto">
              <Link to="/">
                <img src={logo} alt="logo" width="100" height="100" />
              </Link>
            </div>
          </div>

          {/* Middle Content: Menus */}
          <div className="flex flex-col flex-1 mt-6">
            <nav>
              {role === "participant" && <UserMenu />}
              {role === "creator" && <CreatorMenu />}
              {role === "admin" && <AdminMenu />}
            </nav>
          </div>

          {/* Bottom Content: Profile & Logout */}
          <div>
            <hr className="border-gray-300 my-4" />

            <MenuItem
              icon={FcSettings}
              label="Profile"
              address="/dashboard/profile"
            />
            
            <button
              onClick={logOut}
              className="flex cursor-pointer w-full items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-300 hover:text-gray-700 transition-colors duration-300 transform rounded-lg"
            >
              <GrLogout className="w-5 h-5" />
              <span className="mx-4 font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;