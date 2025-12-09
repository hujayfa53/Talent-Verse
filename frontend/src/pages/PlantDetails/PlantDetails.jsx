import Container from "../../components/Shared/Container";
import Heading from "../../components/Shared/Heading";
import Button from "../../components/Shared/Button/Button";
import PurchaseModal from "../../components/Modal/PurchaseModal";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LoadingSpinner from "../../components/Shared/LoadingSpinner";


const PlantDetails = () => {
  let [isOpen, setIsOpen] = useState(false);
  const [isExpired,setIsExpired] = useState(false)
  const { id } = useParams();
  const [timeLeft, setTimeLeft] = useState("");

  const { data: contest = {}, isLoading } = useQuery({
    queryKey: ["contest",id],
    queryFn: async () => {
      const result = await axios(
        `${import.meta.env.VITE_API_URL}/contests/${id}`
      );
      return result.data;
    },
  });

  const closeModal = () => {
    setIsOpen(false);
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


  // formate data
  const formateDeadline = (dateString) => {
    if(!dateString) return <LoadingSpinner />
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US',{
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // live countdown

  useEffect(() => {
    if (!deadline) return;
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(deadline).getTime();
      const distance = end - now;
      if (distance < 0) {
        setTimeLeft("Contest Expired");
        setIsExpired(true)
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
      <div className="mx-auto flex flex-col lg:flex-row justify-between w-full gap-12">
        {/* Header */}
        <div className="flex flex-col gap-6 flex-1">
          <div>
            <div className="w-full overflow-hidden rounded-xl">
              <img
                className="object-cover w-full"
                src={image}
                alt="header image"
              />
            </div>
          </div>
        </div>
        <div className="md:gap-10 flex-1">
          {/* Plant Info */}
          <Heading title={name} subtitle={`Category: ${category}`} />

          {/* --- LIVE COUNTDOWN DISPLAY --- */}
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
            <p className="text-sm text-primary font-semibold uppercase tracking-widest">
              Time Remaining
            </p>
            <p className="text-3xl font-bold text-secondary font-mono">
              {timeLeft}
            </p>
          </div>
          <hr className="my-6" />
          <div
            className="
          text-lg font-light text-neutral-800"
          >
            <span className="text-xl font-semibold"> Description: </span>
            {description}
          </div>
          <hr className="my-6" />
          <div
            className="
          text-lg font-light text-neutral-800"
          >
            <span className="text-xl font-semibold"> Task Instruction: </span>
            {instruction}
          </div>
          <hr className="my-6" />

          <div
            className="
                text-xl 
                font-semibold 
                flex 
                flex-row 
                items-center
                gap-2
              "
          >
            <div>Creator: {creator?.name}</div>

            <img
              className="rounded-full"
              height="30"
              width="30"
              alt="Avatar"
              referrerPolicy="no-referrer"
              src={creator?.image}
            />
          </div>
          <hr className="my-6" />
          <div className="flex justify-between">
            <p
              className="
                gap-4 
                font-light
                text-neutral-800
              "
            >
              Participate: {participate}
            </p>
            <p
              className="
                gap-4 
                font-light
                text-neutral-800
              "
            >
              Deadline: {formateDeadline(deadline)}
            </p>
          </div>
          <hr className="my-6" />
          <div className="flex justify-between">
            <p className="font-bold text-3xl text-gray-800">Prize: {prize}$</p>
            <p className="font-bold text-3xl text-gray-800">Fee: {fee}$</p>
            <div>
              <Button onClick={() => setIsOpen(true)} label="Register" disabled={isExpired}/>
            </div>
          </div>
          <hr className="my-6" />

          <PurchaseModal contest={contest} closeModal={closeModal} isOpen={isOpen} />
        </div>
      </div>
    </Container>
  );
};

export default PlantDetails;
