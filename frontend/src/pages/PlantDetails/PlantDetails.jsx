import Container from "../../components/Shared/Container";
import Heading from "../../components/Shared/Heading";
import Button from "../../components/Shared/Button/Button";
import PurchaseModal from "../../components/Modal/PurchaseModal";
import { useEffect, useState } from "react";
import { useParams } from "react-router"; // Fixed import source (react-router-dom usually)
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LoadingSpinner from "../../components/Shared/LoadingSpinner";
import SubmitModal from "./SubmitModal";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const PlantDetails = () => {
  const { user } = useAuth();
  let [isOpen, setIsOpen] = useState(false);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const { id } = useParams();
  const [timeLeft, setTimeLeft] = useState("");
  const axiosSecure = useAxiosSecure()

  // --------- Fetch Contest Data
  const { data: contest = {}, isLoading } = useQuery({
    queryKey: ["contest", id],
    queryFn: async () => {
      const result = await axios(
        `${import.meta.env.VITE_API_URL}/contests/${id}`
      );
      return result.data;
    },
  });

  // ---------- Check Purchase Status
  const { data: isPurchased = false, isLoading: isPurchaseLoading } = useQuery({
    queryKey: ["isPurchased", id, user?.email],
    queryFn: async () => {
      const result = await axiosSecure.get(`/purchase-check/${id}/${user?.email}`);
      return result.data.purchased
    },
  });

  const closeModal = () => {
    setIsOpen(false);
    setIsSubmitOpen(false)
  };

  const {
    image,
    name,
    description,
    category,
    fee,
    prize,
    creator,
    participate,
    instruction,
    deadline,
  } = contest;

  // Format Date
  const formateDeadline = (dateString) => {
    if (!dateString) return <LoadingSpinner />;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Live Countdown
  useEffect(() => {
    if (!deadline) return;
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(deadline).getTime();
      const distance = end - now;
      if (distance < 0) {
        setTimeLeft("Contest Expired");
        setIsExpired(true);
        clearInterval(interval);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <Container>
      {/* Main Wrapper: Stacks on mobile, Side-by-side on LG screens */}
      <div className="mx-auto flex flex-col lg:flex-row justify-between w-full gap-6 lg:gap-12 pt-6">
        
        {/* Left Side: Image */}
        <div className="flex flex-col gap-6 flex-1">
          <div className="w-full overflow-hidden rounded-xl shadow-lg">
            <img
              className="object-cover w-full h-64 md:h-96 lg:h-full" // Responsive height
              src={image}
              alt="contest header"
            />
          </div>
        </div>

        {/* Right Side: Details */}
        <div className="flex-1">
          
          {/* Header Info */}
          <Heading title={name} subtitle={`Category: ${category}`} />

          {/* Countdown Card */}
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-center shadow-sm">
            <p className="text-xs md:text-sm text-primary font-semibold uppercase tracking-widest mb-1">
              Time Remaining
            </p>
            <p className="text-2xl md:text-3xl font-bold text-secondary font-mono">
              {timeLeft}
            </p>
          </div>

          <hr className="my-6 border-gray-200" />

          {/* Description */}
          <div className="text-base md:text-lg font-light text-neutral-800 leading-relaxed">
            <span className="text-lg md:text-xl font-semibold block mb-2 text-gray-900">Description:</span>
            {description}
          </div>

          <hr className="my-6 border-gray-200" />

          {/* Instructions */}
          <div className="text-base md:text-lg font-light text-neutral-800 leading-relaxed">
            <span className="text-lg md:text-xl font-semibold block mb-2 text-gray-900">Task Instruction:</span>
            {instruction}
          </div>

          <hr className="my-6 border-gray-200" />

          {/* Creator Info */}
          <div className="flex items-center gap-3">
             <span className="text-lg md:text-xl font-semibold text-gray-900">Creator:</span>
             <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                <img
                  className="rounded-full object-cover border border-gray-300"
                  height="30"
                  width="30"
                  alt="Avatar"
                  referrerPolicy="no-referrer"
                  src={creator?.image}
                />
                <span className="font-medium text-gray-700">{creator?.name}</span>
             </div>
          </div>

          <hr className="my-6 border-gray-200" />

          {/* Stats: Stacks on mobile, Row on tablet+ */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">Participants:</span>
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg font-bold">
                 {participate}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">Deadline:</span>
              <span className="text-gray-600">{formateDeadline(deadline)}</span>
            </div>
          </div>

          <hr className="my-6 border-gray-200" />

          {/* Prize & Fee: Stacks on mobile, Row on tablet+ */}
          <div className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div>
                   <p className="text-sm text-gray-500 uppercase font-bold">Winning Prize</p>
                   <p className="font-extrabold text-2xl md:text-3xl text-accent">${prize}</p>
                </div>
                <div className="sm:text-right">
                   <p className="text-sm text-gray-500 uppercase font-bold">Entry Fee</p>
                   <p className="font-extrabold text-2xl md:text-3xl text-primary">${fee}</p>
                </div>
              </div>

              {/* Dynamic Action Button */}
              <div className="w-full">
                {isExpired ? (
                   <Button label="Deadline Passed" disabled={true} />
                ) : isPurchased ? (
                   <Button 
                      onClick={() => setIsSubmitOpen(true)} 
                      label="Submit Task" 
                   />
                ) : (
                   <Button 
                      onClick={() => setIsOpen(true)} 
                      label="Register Now" 
                   />
                )}
              </div>
          </div>

          {/* Modals */}
          <PurchaseModal
            contest={contest}
            closeModal={closeModal}
            isOpen={isOpen}
          />
          
          <SubmitModal 
            isSubmitOpen={isSubmitOpen} 
            closeModal={closeModal} 
            contest={contest}
          />
        </div>
      </div>
    </Container>
  );
};

export default PlantDetails;