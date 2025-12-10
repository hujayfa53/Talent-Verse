import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import { useParams } from 'react-router';
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';
import Heading from '../../../components/Shared/Heading';
import toast from 'react-hot-toast';

const Submissions = () => {
    const {id} = useParams()

    // fetch all submission for this contest
    const {data:submissions=[], isLoading, refetch} = useQuery({
        queryKey:['submissions',id],
        queryFn: async () => {
            const result = await axios.get(`${import.meta.env.VITE_API_URL}/submissions/contest/${id}`)
            return result.data
        }
    })

    // handle declare
    const handleDeclareWinner = async (submission) => {
        try {
            await axios.patch(`${import.meta.env.VITE_API_URL}/contests/winner`,{
                submissionId: submission._id,
                contestId:id,
                winnerName:submission.participantName,
                winnerEmail:submission.participantEmail,
                winnerImage:submission.participantImage
            })
            toast.success('Winner Declared Successfully')
            refetch()
        } catch (error) {
           toast.error(error.response?.data?.message || "Failed to Declare Winner") 
        }
    }

    if(isLoading) return <LoadingSpinner />
    return (
      <div>
      <Heading title="Submissions" subtitle="View user tasks and declare a winner" />
      
      <div className="overflow-x-auto mt-8">
        <table className="table">
          <thead>
            <tr>
              <th>Participant</th>
              <th>Email</th>
              <th>Task Link</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((sub) => (
              <tr key={sub._id} className={sub.status === 'winner' ? 'bg-green-100' : ''}>
                <td>
                    <div className="flex items-center gap-3">
                        <div className="avatar">
                            <div className="mask mask-squircle w-12 h-12">
                                <img src={sub.participantImage} alt="Avatar" />
                            </div>
                        </div>
                        <div>
                            <div className="font-bold">{sub.participantName}</div>
                        </div>
                    </div>
                </td>
                <td>{sub.participantEmail}</td>
                <td>
                    <a href={sub.taskSubmission} target="_blank" className="text-blue-500 underline">
                        View Task
                    </a>
                </td>
                <td className="font-bold uppercase">{sub.status}</td>
                <td>
                  {sub.status === 'winner' ? (
                    <span className="text-green-600 font-bold">WINNER 🏆</span>
                  ) : (
                    <button 
                        onClick={() => handleDeclareWinner(sub)}
                        className="btn btn-xs btn-primary"
                        // Disable if there is already a winner in the list (optional logic)
                    >
                      Declare Win
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {submissions.length === 0 && <p className="text-center mt-4">No submissions yet.</p>}
      </div>
    </div>
    );
};

export default Submissions;