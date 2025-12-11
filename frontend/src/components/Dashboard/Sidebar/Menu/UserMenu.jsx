import { BsFingerprint } from "react-icons/bs";
import { GrUserAdmin } from "react-icons/gr";
import MenuItem from "./MenuItem";
import { useState } from "react";
import BecomeCreatorModal from "../../../Modal/BecomeCreatorModal";
const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <MenuItem
        icon={BsFingerprint}
        label="My Participated Contest"
        address="My-participate"
      />
      <MenuItem
        icon={BsFingerprint}
        label="My Winning Contest"
        address="my-winning-contest"
      />

      <div
        onClick={() => setIsOpen(true)}
        className="flex items-center px-4 py-2 mt-5  transition-colors duration-300 transform text-gray-600  hover:bg-gray-300   hover:text-gray-700 cursor-pointer"
      >
        <GrUserAdmin className="w-5 h-5" />

        <span className="mx-4 font-medium">Become A Creator</span>
      </div>

      <BecomeCreatorModal closeModal={closeModal} isOpen={isOpen} />
    </>
  );
};

export default UserMenu;
