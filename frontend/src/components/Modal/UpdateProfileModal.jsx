import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import useAuth from '../../hooks/useAuth';
import axios from 'axios';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../hooks/useAxiosSecure'
const UpdateProfileModal = ({ isOpen, closeModal, refetch }) => {
  const { user, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const axiosSecure = useAxiosSecure();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const form = e.target;
    const name = form.name.value;
    const photoURL = form.photoURL.value;
    const address = form.address.value; 

    try {
      await updateUserProfile(name, photoURL);

      await axiosSecure.put(`/users/${user?.email}`, {
        name,
        image: photoURL,
        address
      });

      toast.success("Profile Updated Successfully!");
      
      if (refetch) refetch();
      
      closeModal();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 mb-4"
                >
                  Update Profile Info
                </Dialog.Title>
                
                <form onSubmit={handleSubmit} className='space-y-4'>
                  {/* Name Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input 
                      type="text" 
                      name="name" 
                      defaultValue={user?.displayName} 
                      className="w-full border border-gray-300 p-2 rounded-md focus:ring-secondary focus:border-secondary" 
                      required 
                    />
                  </div>
                  
                  {/* Photo URL Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Profile Photo URL
                    </label>
                    <input 
                      type="text" 
                      name="photoURL" 
                      defaultValue={user?.photoURL} 
                      className="w-full border border-gray-300 p-2 rounded-md focus:ring-secondary focus:border-secondary" 
                      required 
                    />
                  </div>

                  {/* Address / Bio Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address / Bio
                    </label>
                    <textarea 
                      name="address" 
                      rows="3" 
                      placeholder='e.g. 123 Green St, New York, USA' 
                      className="w-full border border-gray-300 p-2 rounded-md focus:ring-secondary focus:border-secondary"
                    ></textarea>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          Saving...
                        </span>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default UpdateProfileModal;