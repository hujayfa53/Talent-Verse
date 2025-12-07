import { useState } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
const AddPlantForm = () => {
  const [startDate, setStartDate] = useState(new Date());
  return (
    <div className="w-full min-h-[calc(100vh-40px)] flex flex-col justify-center items-center text-gray-800 rounded-xl bg-gray-50">
      <form>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            {/* Name */}
            <div className="space-y-1 text-sm">
              <label htmlFor="name" className="block text-gray-600">
                Contest Name
              </label>
              <input
                className="w-full px-4 py-3 text-gray-800 border border-secondary focus:outline-secondary rounded-md bg-white"
                name="name"
                id="name"
                type="text"
                placeholder="Contest Name"
                required
              />
            </div>
            {/* deadline */}
            <div className="space-y-1 text-sm">
              <label htmlFor="contestDate" className="block text-gray-600">
              Deadline
              </label>

              {/* DatePicker Component */}
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                // Applying your existing input styles here
                className="w-full px-4 py-3 text-gray-800 border border-secondary focus:outline-secondary rounded-md bg-white"
                placeholderText="Select a date"
                dateFormat="dd/MM/yyyy"
                id="contestDate"
              />
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
              >
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
              ></textarea>
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
                  name="entry fee"
                  id="fee"
                  type="number"
                  placeholder="Entry Fee"
                  required
                />
              </div>

              {/* Quantity */}
              <div className="space-y-1 text-sm">
                <label htmlFor="prize" className="block text-gray-600">
                  Prize Money
                </label>
                <input
                  className="w-full px-4 py-3 text-gray-800 border border-secondary focus:outline-secondary rounded-md bg-white"
                  name="prize"
                  id="prize"
                  type="number"
                  placeholder="Prize Money"
                  required
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
              Save & Continue
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddPlantForm;
