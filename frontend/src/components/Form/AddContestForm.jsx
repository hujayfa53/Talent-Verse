import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm, Controller } from "react-hook-form";
import { imageUpload } from "../../utils";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import LoadingSpinner from "../Shared/LoadingSpinner";
import ErrorPage from "../../pages/ErrorPage";
import { TbFidgetSpinner } from "react-icons/tb";

const AddContestForm = () => {
  const [startDate, setStartDate] = useState(new Date());
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();


// put , patch ,post , delete ....
  const {
    isPending,
    isError,
    mutateAsync,
    reset: mutationReset,
  } = useMutation({
    mutationFn: async (payload) => await axiosSecure.post(`/contests`, payload),
    onSuccess: (data) => {
      console.log(data);
      toast.success("Contest Added Successfully");
      mutationReset();
    },
    onError: (error) => {
      console.log(error);
    },
    onMutate: (payload) => {
      console.log("I will post this data ", payload);
    },
    onSettled: (data, error) => {
      console.log("i am from on setteld", data);
      if (error) console.log(error);
    },
    retry: 3,
  });

  // React hook form
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    const {
      name,
      description,
      fee,
      category,
      image,
      participate,
      instruction,
      prize,
      deadline,
    } = data;
    const imageFile = image[0];
// send data
    try {
      const imageUrl = await imageUpload(imageFile);
      const contestData = {
        image: imageUrl,
        name,
        description,
        instruction,
        category,
        fee: Number(fee),
        prize: Number(prize),
        participate: Number(participate),
        deadline,
        status:'pending',
        creator: {
          image: user?.photoURL,
          name: user?.displayName,
          email: user?.email,
        },
      };
      await mutateAsync(contestData);
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  if (isPending) return <LoadingSpinner />;
  if (isError) return <ErrorPage />;
  return (
    <div className="w-full min-h-[calc(100vh-40px)] flex flex-col justify-center items-center text-gray-800 rounded-xl bg-gray-50">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            {/* Name */}
            <div className="space-y-1 text-sm">
              <label htmlFor="name" className="block text-gray-600">
                Contest Name
              </label>
              <input
                className="w-full px-4 py-3 text-gray-800 border border-secondary focus:outline-secondary rounded-md bg-white"
                id="name"
                type="text"
                placeholder="Contest Name"
                {...register("name", { required: "Contest Name is required" })}
              />
              {errors.name && (
                <p className="text-accent">{errors.name.message}</p>
              )}
            </div>
            {/* deadline */}
            <div className="space-y-1 text-sm">
              <label htmlFor="deadline" className="block text-gray-600">
                Contest Deadline
              </label>

              {/*  Use Controller instead of register directly */}
              <Controller
                control={control} // Make sure you pass 'control' from useForm() here
                name="deadline"
                rules={{ required: "Deadline is required" }}
                render={({ field }) => (
                  <DatePicker
                    className="w-full px-4 py-3 text-gray-800 border border-secondary focus:outline-secondary rounded-md bg-white"
                    placeholderText="Select Deadline"
                    // Link React Hook Form to DatePicker
                    selected={field.value}
                    onChange={(date) => {
                      field.onChange(date); // Update Form State
                      setStartDate(date); // Update Local State (for your helper text)
                    }}
                    dateFormat="dd.MM.yy"
                    id="deadline"
                  />
                )}
              />

              {errors.deadline && (
                <p className="text-red-500">{errors.deadline.message}</p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-1 text-sm">
              <label htmlFor="category" className="block text-gray-600 ">
                Category
              </label>
              <select
                required
                className="w-full px-4 py-3 border border-secondary focus:outline-secondary rounded-md bg-white"
                name="category"
                {...register("category", { required: "Category is required" })}
              >
                {errors.category && (
                  <p className="text-accent">{errors.category.message}</p>
                )}
                <option value="Coding">Coding</option>
                <option value="Business Ideas">Business Ideas</option>
                <option value="Photography">Photography</option>
                <option value="Article">Article</option>
                <option value="Design">Design</option>
              </select>
            </div>

            {/* Instruction */}
            <div className="space-y-1 text-sm">
              <label htmlFor="instruction" className="block text-gray-600">
                Task Instruction
              </label>

              <textarea
                id="instruction"
                placeholder="Write contest Instruction here..."
                className="block rounded-md focus:lime-300 w-full h-32 px-4 py-3 text-gray-800  border border-secondary bg-white focus:outline-secondary "
                name="instruction"
                {...register("instruction", {
                  required: "Instruction is required",
                })}
              ></textarea>
              {errors.instruction && (
                <p className="text-accent">{errors.instruction.message}</p>
              )}
            </div>

            {/* description*/}
            <div className="space-y-1 text-sm">
              <label htmlFor="description" className="block text-gray-600">
                Description
              </label>

              <textarea
                id="description"
                placeholder="Write contest description here..."
                className="block rounded-md focus:lime-300 w-full h-32 px-4 py-3 text-gray-800  border border-secondary bg-white focus:outline-secondary "
                {...register("description", {
                  required: "Description is required",
                })}
              ></textarea>
              {errors.description && (
                <p className="text-accent">{errors.description.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-6 flex flex-col">
            {/* Fee & prize */}
            <div className="flex justify-between gap-2">
              {/* Fee */}
              <div className="space-y-1 text-sm">
                <label htmlFor="fee" className="block text-gray-600 ">
                  Entry Fee
                </label>
                <input
                  className="w-full px-4 py-3 text-gray-800 border border-secondary focus:outline-secondary rounded-md bg-white"
                  id="fee"
                  type="number"
                  placeholder="Entry Fee"
                  {...register("fee", {
                    required: "Fee is required",
                    min: { value: 0, message: "Fee must be positive" },
                  })}
                />
                {errors.fee && (
                  <p className="text-accent">{errors.fee.message}</p>
                )}
              </div>

              {/* Quantity */}
              <div className="space-y-1 text-sm">
                <label htmlFor="prize" className="block text-gray-600">
                  Prize Money
                </label>
                <input
                  className="w-full px-4 py-3 text-gray-800 border border-secondary focus:outline-secondary rounded-md bg-white"
                  id="prize"
                  type="number"
                  placeholder="Prize Money"
                  {...register("prize", {
                    required: "Prize is required",
                    min: { value: 0, message: "Prize must be positive" },
                  })}
                />
                {errors.prize && (
                  <p className="text-accent">{errors.prize.message}</p>
                )}
              </div>
              {/* participate count */}
              <div className="space-y-1 text-sm">
                <label htmlFor="participate" className="block text-gray-600">
                  Participant
                </label>
                <input
                  className="w-full px-4 py-3 text-gray-800 border border-secondary focus:outline-secondary rounded-md bg-white"
                  id="participate"
                  type="number"
                  placeholder="Participate"
                  defaultValue={0}
                  {...register("participate", {})}
                />
              </div>
            </div>

            {/* Image */}
            <div className=" p-4  w-full  m-auto rounded-lg grow">
              <div className="file_upload px-5 py-3 relative border-4 border-dotted border-gray-300 rounded-lg">
                <div className="flex flex-col w-max mx-auto text-center">
                  <label>
                    <input
                      className="text-sm cursor-pointer w-36 hidden"
                      type="file"
                      name="image"
                      id="image"
                      accept="image/*"
                      hidden
                      {...register("image", { required: "image is required" })}
                    />
                    <div className="bg-secondary text-white border border-gray-300 rounded font-semibold cursor-pointer p-1 px-3 hover:bg-primary">
                      Upload
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full cursor-pointer p-3 mt-5 text-center font-medium text-white transition duration-200 rounded shadow-md bg-primary "
            >
              {isPending ? (
                <TbFidgetSpinner className='animate-spin m-auto' />
              ) : (
                'Save & Continue'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddContestForm;
