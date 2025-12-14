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
    <section className="py-8 md:py-12">
      <Container>
        <div>
          <h1 className="text-center text-2xl md:text-3xl lg:text-4xl mt-5 text-primary font-bold mb-8 md:mb-12">
            Popular Contests
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {contests.map((contest) => (
              <PopularContestsCard key={contest._id} contest={contest} />
            ))}
          </div>

      
          <div className="text-center mt-8 md:mt-12">
            <Link
              to="/all-contests"
              className="btn btn-primary px-8 py-3 rounded-full text-white text-lg font-semibold hover:scale-105 transition-transform"
            >
              Show All Contests
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default PopularContest;