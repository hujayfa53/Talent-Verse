import { FaUserCog } from "react-icons/fa";
import MenuItem from "./MenuItem";
import { MdOutlineManageHistory } from "react-icons/md";

const AdminMenu = () => {
  return (
    <>
      <MenuItem icon={FaUserCog} label="Manage Users" address="manage-users" />

      <MenuItem
        icon={MdOutlineManageHistory}
        label="Manage Contests"
        address="manage-contests"
      />
    </>
  );
};

export default AdminMenu;
