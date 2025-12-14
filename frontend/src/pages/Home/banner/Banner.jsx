import React from "react";
import banner3 from "../../../assets/images/banner3.png";
import Container from "../../../components/Shared/Container";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";

const Banner = () => {
  return (
    <div>
      <Container>
        {/* search */}
           <form
        // onSubmit={handleSearch}
        className=" mt-5 mb-10 flex gap-2 justify-center"
      >
        {/* <label className="input rounded-full ">
          <svg
            className="h-[1em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input name="search" type="search" placeholder="Search" />
        </label> */}
        {/*  */}
        <select
          name="experienceLevel"
          className="select select-bordered rounded-full"
        >
          <option value="">All Levels</option>
          <option value="Coding">Coding</option>
          <option value="Business Idea">Business Idea</option>
          <option value="Photography">Photography</option>
          <option value="Design">Design</option>
          <option value="Article">Article</option>
        </select>

        <button className="btn bg-blue-500  rounded-full">
          {LoadingSpinner ? "Searching...." : "Search"}
        </button>
      </form>
        <img src={banner3} alt=""  className="rounded"/>
      </Container>
    </div>
  );
};

export default Banner;
