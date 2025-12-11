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
      <MenuItem
        icon={MdOutlineManageHistory}
        label="Manage Contests"
        address="creator-request"
      />
    </>
  );
};

export default AdminMenu;
