import axios from "axios";
import React, { useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { IoBagCheckOutline } from 'react-icons/io5'
import useAxiosSecure from "../../hooks/useAxiosSecure";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const axiosSecure = useAxiosSecure()

//   one time fetch

  useEffect(() => {
    if (sessionId) {
      axiosSecure.post(`/payment-success`, {
        sessionId,
      });
    }
  }, [sessionId]);
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center">
        <IoBagCheckOutline className="w-16 h-16 text-primary mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for your Register.
        </p>
        <Link
          to="/dashboard/my-participate"
          className="inline-block bg-primary text-white font-semibold py-2 px-4 rounded hover:bg-primary transition duration-300"
        >
          Go to My Participate Contests
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
