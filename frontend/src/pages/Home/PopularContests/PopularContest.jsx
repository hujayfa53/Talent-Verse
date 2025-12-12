import React from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import PopularContestsCard from "./PopularContestsCard";
import { Link } from "react-router";
import Container from "../../../components/Shared/Container";

const PopularContest = () => {
  const axiosSecure = useAxiosSecure();

  const { data: contests = [], isLoading } = useQuery({
    queryKey: ["popular-contests"],
    queryFn: async () => {
      const result = await axiosSecure("/popular-contests");
      return result.data;
    },
  });

  if (isLoading) return <LoadingSpinner />;
  return (
    <Container>
      <div>
        <h1 className="text-center text-3xl mt-5 text-primary font-bold">
          Popular Contests
        </h1>
        <div className="grid grid-cols-3 gap-3 mt-10">
          {contests.map((contest) => (
            <PopularContestsCard key={contest._id} contest={contest} />
          ))}
        </div>
        <div className="text-center mt-5">
          <Link
            to="/all-contests"
            className=" text-2xl btn btn-primary rounded-2xl"
          >
            Show All
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default PopularContest;
