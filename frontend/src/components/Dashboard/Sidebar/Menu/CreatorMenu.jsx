import { BsFillHouseAddFill } from "react-icons/bs";
import { MdHomeWork, MdOutlineManageHistory } from "react-icons/md";
import MenuItem from "./MenuItem";
const CreatorMenu = () => {
  return (
    <>
      <MenuItem
        icon={BsFillHouseAddFill}
        label="Add Contests"
        address="add-contests"
      />
      <MenuItem icon={MdHomeWork} label="My Created Contests" address="my-created-contests" />

     

      
    </>
  );
};

export default CreatorMenu;
