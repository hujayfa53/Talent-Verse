import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { Link, useParams } from "react-router";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import Heading from "../../../components/Shared/Heading";
import toast from "react-hot-toast";

const Submissions = () => {
  const { id } = useParams();
  

  const {
    data: submissions = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["submissions", id],
    queryFn: async () => {
      const result = await axios.get(
        `${import.meta.env.VITE_API_URL}/submissions/contest/${id}`
      );
      return result.data;
    },
  });

  //   Check if a winner already exists in the loaded data
  const isWinnerDeclared = submissions.some(sub => sub.status === 'winner');

  const handleDeclareWinner = async (submission) => {
    if(isWinnerDeclared) return toast.error("Winner already declared!");

    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/contests/winner`, {
        submissionId: submission._id,
        contestId: id,
        winnerName: submission.participantName,
        winnerEmail: submission.participantEmail,
        winnerImage: submission.participantImage,
      });
      toast.success("Winner Declared Successfully");
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to Declare Winner");
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <Heading
        title="Submissions"
        subtitle="View user tasks and declare a winner"
      />

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
              <tr
                key={sub._id}
                className={sub.status === "winner" ? "bg-green-100" : ""}
              >
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

                {/* Task Link Column */}
                <td>
                  <Link
                    to={`/dashboard/single-submissions/${sub._id}`}
                    className="text-blue-500 hover:underline font-medium transition-colors"
                  >
                    View Submission
                  </Link>
                </td>

                <td className="font-bold uppercase">{sub.status}</td>
                <td>
                  {sub.status === "winner" ? (
                    <span className="text-green-600 font-bold">WINNER 🏆</span>
                  ) : (
                    <button
                      onClick={() => handleDeclareWinner(sub)}
                      disabled={isWinnerDeclared} // Disable if ANY winner exists
                      className={`btn btn-xs btn-primary ${
                        isWinnerDeclared ? "cursor-not-allowed opacity-50" : ""
                      }`}
                      title={isWinnerDeclared ? "Winner already declared" : "Declare Winner"}
                    >
                      Declare Win
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {submissions.length === 0 && (
          <p className="text-center mt-4">No submissions yet.</p>
        )}
      </div>
    </div>
  );
};

export default Submissions;