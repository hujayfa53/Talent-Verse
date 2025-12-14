import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import AdminContestsRow from "../../../components/Dashboard/TableRows/AdminContestsRow";

const ManageContests = () => {
  const axiosSecure = useAxiosSecure();
  const {
    data: contests = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["manage-contests"],
    queryFn: async () => {
      const result = await axiosSecure(`manage-contests`);
      return result.data;
    },
  });

  if (isLoading) return <LoadingSpinner />;
  return (
    <>
      <div className="container mx-auto px-4 sm:px-8">
        <div className="py-8">
          <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal whitespace-nowrap"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal whitespace-nowrap"
                    >
                      User
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal whitespace-nowrap"
                    >
                      Fee
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal whitespace-nowrap"
                    >
                      Prize
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal whitespace-nowrap"
                    >
                      Deadline
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal whitespace-nowrap"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {contests.map((contest) => (
                    <AdminContestsRow
                      key={contest._id}
                      contest={contest}
                      refetch={refetch}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageContests;