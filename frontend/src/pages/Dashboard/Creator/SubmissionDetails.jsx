import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router';
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';

const SubmissionDetails = () => {
    const {id} = useParams()
    const navigate = useNavigate()

    // the single submission
    const {data: submission = {},isLoading} = useQuery({
        queryKey:['submission', id],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/submissions/${id}`)
            return res.data
        }
    })
    const { 
    participantName, 
    participantEmail, 
    participantImage, 
    taskSubmission, 
    status,
    contestId 
  } = submission;

    // handle declare winner

    const handleDeclareWinner = async () => {
       try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/contests/winner`, {
        submissionId: id,
        contestId: contestId,
        winnerName: participantName,
        winnerEmail: participantEmail,
        winnerImage: participantImage
      });
      toast.success("Winner Declared Successfully!");
      navigate(-1); // Go back to the list
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to declare winner");
    }
    }

    if(isLoading) return <LoadingSpinner />
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10 border border-gray-100">
      {/* Header: User Info */}
      <div className="flex items-center gap-6 mb-8 border-b pb-6">
        <img 
          src={participantImage} 
          alt="User" 
          className="w-20 h-20 rounded-full border-4 border-green-100" 
        />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{participantName}</h2>
          <p className="text-gray-500">{participantEmail}</p>
          <div className="mt-2">
            <span className={`px-3 py-1 rounded-full text-sm font-bold uppercase ${status === 'winner' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                Status: {status}
            </span>
          </div>
        </div>
      </div>

      {/* The Submission Content */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Submission Content:</h3>
        
        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
           {/* Check if it's a link */}
           {taskSubmission?.startsWith('http') ? (
             <div>
                <p className="mb-2 text-gray-600">The user provided a link:</p>
                <a 
                  href={taskSubmission} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-blue-600 underline break-all text-lg font-medium hover:text-blue-800"
                >
                  {taskSubmission}
                </a>
             </div>
           ) : (
             <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                {taskSubmission}
             </p>
           )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <button 
            onClick={() => navigate(-1)}
            className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 font-medium transition"
        >
            Go Back
        </button>

        {status !== 'winner' && (
             <button 
                onClick={handleDeclareWinner}
                className="px-6 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-bold transition shadow-lg hover:shadow-xl"
             >
                Declare Winner 🏆
             </button>
        )}
      </div>
    </div>
    );
};

export default SubmissionDetails;