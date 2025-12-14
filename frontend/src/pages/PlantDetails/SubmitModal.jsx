import React, { useState } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import useAuth from '../../hooks/useAuth';
import axios from 'axios';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../hooks/useAxiosSecure'

const SubmitModal = ({ closeModal, isSubmitOpen, contest }) => {
  const { user } = useAuth();
  const [submission, setSubmission] = useState('');
  const axiosSecure = useAxiosSecure()

  const handleSubmit = async () => {
    //  Validation
    if (!submission.trim()) return toast.error("Please write something or paste a link.");

    const submissionData = {
      contestId: contest?._id,
      contestName: contest?.name, 
      participantEmail: user?.email,
      participantName: user?.displayName,
      participantImage: user?.photoURL,
      taskSubmission: submission,
      status: 'pending', 
      submittedAt: new Date(),
    };

    try {
      //  Send to Backend
      await axiosSecure.post(`/submissions`, submissionData);
      
      toast.success("Task Submitted Successfully!");
      setSubmission('');
      closeModal();      
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Submission failed. You may have already submitted.");
    }
  };

  return (
    <Dialog
      open={isSubmitOpen}
      as='div'
      className='relative z-10 focus:outline-none'
      onClose={closeModal}
    >
      <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
        <div className='flex min-h-full items-center justify-center p-4'>
          <DialogPanel
            transition
            className='w-full max-w-md bg-white p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0 shadow-xl rounded-2xl'
          >
            <DialogTitle
              as='h3'
              className='text-lg font-medium text-center leading-6 text-gray-900'
            >
              Submit Your Task
            </DialogTitle>

            <div className='mt-2'>
              <p className='text-sm text-gray-500 text-center mb-4'>
                {contest?.name}
              </p>
            </div>

            {/* --- Text Area Section --- */}
            <div className='mt-4'>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Submission Description or Link
              </label>
              <textarea
                rows={4}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:border-green-500 text-sm"
                placeholder="Paste your Google Drive link, Github repo, or type your answer here..."
                value={submission}
                onChange={(e) => setSubmission(e.target.value)}
              />
            </div>

            {/* --- Buttons --- */}
            <div className='flex mt-6 justify-around'>
              <button
                type='button'
                onClick={handleSubmit}
                className='cursor-pointer inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2'
              >
                Submit
              </button>
              <button
                type='button'
                className='cursor-pointer inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2'
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default SubmitModal;