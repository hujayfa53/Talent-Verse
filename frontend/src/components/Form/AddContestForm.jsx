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

  // React Query Mutation
  const {
    isPending,
    isError,
    mutateAsync,
    reset: mutationReset,
  } = useMutation({
    mutationFn: async (payload) => await axiosSecure.post(`/contests`, payload),
    onSuccess: (data) => {
      toast.success("Contest Added Successfully");
      mutationReset();
    },
    onError: (error) => {
      console.log(error);
      toast.error("Failed to add contest");
    },
  });

  // React Hook Form
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
        status: 'pending',
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
    <div className="w-full min-h-[calc(100vh-40px)] flex flex-col justify-center items-center text-gray-800 rounded-xl bg-gray-50 p-4 md:p-8 lg:p-12">
      
      <div className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-sm p-6 md:p-10">
          <h2 className="text-2xl font-bold text-center mb-8 text-primary">Create New Contest</h2>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
              
              {/* LEFT COLUMN */}
              <div className="space-y-6">
                
                {/* Name */}
                <div className="space-y-1 text-sm">
                  <label htmlFor="name" className="block text-gray-600 font-medium">
                    Contest Name
                  </label>
                  <input
                    className="w-full px-4 py-3 text-gray-800 border border-gray-300 focus:border-secondary focus:outline-none rounded-md bg-gray-50 focus:bg-white transition-colors"
                    id="name"
                    type="text"
                    placeholder="e.g., Best Photography 2024"
                    {...register("name", { required: "Contest Name is required" })}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>

                {/* Deadline */}
                <div className="space-y-1 text-sm">
                  <label htmlFor="deadline" className="block text-gray-600 font-medium">
                    Contest Deadline
                  </label>
                  <Controller
                    control={control}
                    name="deadline"
                    rules={{ required: "Deadline is required" }}
                    render={({ field }) => (
                      <div className="w-full">
                        <DatePicker
                          className="w-full px-4 py-3 text-gray-800 border border-gray-300 focus:border-secondary focus:outline-none rounded-md bg-gray-50 focus:bg-white transition-colors"
                          placeholderText="Select Deadline"
                          selected={field.value}
                          onChange={(date) => {
                            field.onChange(date);
                            setStartDate(date);
                          }}
                          dateFormat="dd/MM/yyyy"
                          wrapperClassName="w-full" // Ensures DatePicker takes full width
                        />
                      </div>
                    )}
                  />
                  {errors.deadline && <p className="text-red-500 text-xs mt-1">{errors.deadline.message}</p>}
                </div>

                {/* Category */}
                <div className="space-y-1 text-sm">
                  <label htmlFor="category" className="block text-gray-600 font-medium">
                    Category
                  </label>
                  <select
                    required
                    className="w-full px-4 py-3 border border-gray-300 focus:border-secondary focus:outline-none rounded-md bg-gray-50 focus:bg-white transition-colors"
                    name="category"
                    {...register("category", { required: "Category is required" })}
                  >
                    <option value="">Select Category</option>
                    <option value="Coding">Coding</option>
                    <option value="Business Idea">Business Idea</option>
                    <option value="Photography">Photography</option>
                    <option value="Article">Article</option>
                    <option value="Design">Design</option>
                  </select>
                  {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
                </div>

                {/* Instruction */}
                <div className="space-y-1 text-sm">
                  <label htmlFor="instruction" className="block text-gray-600 font-medium">
                    Task Instruction
                  </label>
                  <textarea
                    id="instruction"
                    placeholder="Explain what participants need to do..."
                    className="block w-full h-32 px-4 py-3 text-gray-800 border border-gray-300 focus:border-secondary focus:outline-none rounded-md bg-gray-50 focus:bg-white transition-colors resize-none"
                    {...register("instruction", { required: "Instruction is required" })}
                  ></textarea>
                  {errors.instruction && <p className="text-red-500 text-xs mt-1">{errors.instruction.message}</p>}
                </div>

                {/* Description */}
                <div className="space-y-1 text-sm">
                  <label htmlFor="description" className="block text-gray-600 font-medium">
                    Description
                  </label>
                  <textarea
                    id="description"
                    placeholder="Describe your contest in detail..."
                    className="block w-full h-32 px-4 py-3 text-gray-800 border border-gray-300 focus:border-secondary focus:outline-none rounded-md bg-gray-50 focus:bg-white transition-colors resize-none"
                    {...register("description", { required: "Description is required" })}
                  ></textarea>
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-6 flex flex-col">
                
                {/* Fee & Prize Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Fee */}
                  <div className="space-y-1 text-sm">
                    <label htmlFor="fee" className="block text-gray-600 font-medium">
                      Entry Fee ($)
                    </label>
                    <input
                      className="w-full px-4 py-3 text-gray-800 border border-gray-300 focus:border-secondary focus:outline-none rounded-md bg-gray-50 focus:bg-white transition-colors"
                      id="fee"
                      type="number"
                      placeholder="0"
                      {...register("fee", { required: "Fee is required", min: 0 })}
                    />
                    {errors.fee && <p className="text-red-500 text-xs mt-1">{errors.fee.message}</p>}
                  </div>

                  {/* Prize */}
                  <div className="space-y-1 text-sm">
                    <label htmlFor="prize" className="block text-gray-600 font-medium">
                      Prize Money ($)
                    </label>
                    <input
                      className="w-full px-4 py-3 text-gray-800 border border-gray-300 focus:border-secondary focus:outline-none rounded-md bg-gray-50 focus:bg-white transition-colors"
                      id="prize"
                      type="number"
                      placeholder="0"
                      {...register("prize", { required: "Prize is required", min: 0 })}
                    />
                    {errors.prize && <p className="text-red-500 text-xs mt-1">{errors.prize.message}</p>}
                  </div>
                </div>

                <input type="hidden" defaultValue={0} {...register("participate")} />

                {/* Image Upload Area */}
                <div className="w-full flex-grow flex flex-col">
                    <label className="block text-gray-600 font-medium mb-2 text-sm">
                        Contest Banner
                    </label>
                    <div className="flex-grow flex justify-center items-center border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition p-6 bg-white">
                        <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                            <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            {...register("image", { required: "Image is required" })}
                            />
                            <div className="flex flex-col items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="bg-secondary text-white px-4 py-2 rounded-md font-semibold hover:bg-primary transition shadow-md">
                                    Upload Image
                                </span>
                                <p className="text-xs text-gray-400 mt-2">PNG, JPG up to 5MB</p>
                            </div>
                        </label>
                    </div>
                    {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image.message}</p>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full cursor-pointer py-4 mt-6 text-center font-bold text-white transition duration-200 rounded-lg shadow-lg bg-primary hover:bg-opacity-90 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isPending ? (
                    <div className="flex justify-center items-center gap-2">
                        <TbFidgetSpinner className='animate-spin text-xl' /> 
                        <span>Processing...</span>
                    </div>
                  ) : (
                    'Create Contest'
                  )}
                </button>
              </div>
            </div>
          </form>
      </div>
    </div>
  );
};

export default AddContestForm;