import { useQuery } from "@tanstack/react-query";
import PlantDataRow from "../../../components/Dashboard/TableRows/PlantDataRow";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";

const MyCreatedContests = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: contests = [], isLoading } = useQuery({
    queryKey: ["createdContests", user?.email],
    queryFn: async () => {
      const result = await axiosSecure(`/my-created-contests/${user?.email}`);
      return result.data;
    },
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 sm:px-8 py-8">
      <div className="flex flex-col">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow-md rounded-lg border border-gray-200">
              <table className="min-w-full leading-normal">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-5 py-3 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Image
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Submissions
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Delete
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Update
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contests.map((contest) => (
                    <PlantDataRow key={contest._id} contest={contest} />
                  ))}
                </tbody>
              </table>
              {contests.length === 0 && (
                <div className="p-6 text-center text-gray-500 bg-white">
                  No contests found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCreatedContests;