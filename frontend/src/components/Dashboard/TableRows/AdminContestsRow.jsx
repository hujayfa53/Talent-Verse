import axios from 'axios';
import React from 'react';
import toast from 'react-hot-toast';

const AdminContestsRow = ({contest,refetch}) => {

    const { _id, name, image, fee, prize, deadline, creator } = contest;

    const handleDelete = async () => {
    if(!confirm("Are you sure you want to delete this contest?")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/contests/${_id}`);
      toast.success("Contest Deleted Successfully");
      refetch(); // Reload the table
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete");
    }
  };
    return (
      <tr>
      {/* 1. Name & Image */}
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <div className="flex items-center">
          <div className="flex-shrink-0 w-10 h-10">
            <img className="w-full h-full rounded-full object-cover" src={image} alt={name} />
          </div>
          <div className="ml-3">
            <p className="text-gray-900 whitespace-no-wrap font-bold">{name}</p>
          </div>
        </div>
      </td>

      {/* 2. Creator Info */}
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">{creator?.name || "Unknown"}</p>
        <p className="text-gray-400 text-xs">{creator?.email}</p>
      </td>

      {/* 3. Fee */}
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">${fee}</p>
      </td>

      {/* 4. Prize */}
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">${prize}</p>
      </td>

      {/* 5. Deadline */}
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">
          {new Date(deadline).toLocaleDateString()}
        </p>
      </td>

      {/* 6. Action */}
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <button 
          onClick={handleDelete}
          className="relative inline-block px-3 py-1 font-semibold text-red-900 leading-tight cursor-pointer"
        >
          <span className="absolute inset-0 bg-red-200 opacity-50 rounded-full"></span>
          <span className="relative">Delete</span>
        </button>
      </td>
    </tr>
    );
};

export default AdminContestsRow;