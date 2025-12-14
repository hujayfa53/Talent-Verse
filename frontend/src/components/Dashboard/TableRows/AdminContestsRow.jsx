import React from "react";
import toast from "react-hot-toast";
import useAxiosSecure from '../../../hooks/useAxiosSecure'
const AdminContestsRow = ({ contest, refetch }) => {
  const axiosSecure = useAxiosSecure();
  const { _id, name, image, fee, prize, deadline, creator } = contest;

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this contest?")) return;

    try {
      await axiosSecure.delete(`/contests/${_id}`);
      toast.success("Contest Deleted Successfully");
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete");
    }
  };

  return (
    <tr>
      <td className="px-3 py-3 sm:px-5 sm:py-5 border-b border-gray-200 bg-white text-sm">
        <div className="flex items-center">
          <div className="flex-shrink-0 w-10 h-10">
            <img
              className="w-full h-full rounded-full object-cover"
              src={image}
              alt={name}
            />
          </div>
          <div className="ml-3">
            <p className="text-gray-900 whitespace-nowrap font-bold">{name}</p>
          </div>
        </div>
      </td>

      <td className="px-3 py-3 sm:px-5 sm:py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-nowrap">
          {creator?.name || "Unknown"}
        </p>
        <p className="text-gray-400 text-xs whitespace-nowrap">
          {creator?.email}
        </p>
      </td>

      <td className="px-3 py-3 sm:px-5 sm:py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-nowrap">${fee}</p>
      </td>

      <td className="px-3 py-3 sm:px-5 sm:py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-nowrap">${prize}</p>
      </td>

      <td className="px-3 py-3 sm:px-5 sm:py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-nowrap">
          {new Date(deadline).toLocaleDateString()}
        </p>
      </td>

      <td className="px-3 py-3 sm:px-5 sm:py-5 border-b border-gray-200 bg-white text-sm">
        <button
          onClick={handleDelete}
          className="relative inline-block px-3 py-1 font-semibold text-red-900 leading-tight cursor-pointer transition-transform active:scale-95"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-red-200 opacity-50 rounded-full"
          ></span>
          <span className="relative whitespace-nowrap">Delete</span>
        </button>
      </td>
    </tr>
  );
};

export default AdminContestsRow;
