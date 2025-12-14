import { useState } from 'react'
import DeleteModal from '../../Modal/DeleteModal'
import UpdatePlantModal from '../../Modal/UpdatePlantModal'
import { Link } from 'react-router'

const PlantDataRow = ({ contest }) => {
  let [isOpen, setIsOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  function openModal() {
    setIsOpen(true)
  }
  function closeModal() {
    setIsOpen(false)
  }
  const { image, name, status, category, _id } = contest

  return (
    <tr>
      <td className='px-3 py-3 md:px-5 md:py-5 border-b border-gray-200 bg-white text-sm'>
        <div className='flex items-center'>
          <div className='shrink-0'>
            <div className='block relative'>
              <img
                alt='profile'
                src={image}
                className='mx-auto object-cover rounded h-10 w-16'
              />
            </div>
          </div>
        </div>
      </td>
      <td className='px-3 py-3 md:px-5 md:py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-nowrap'>{name}</p>
      </td>
      <td className='px-3 py-3 md:px-5 md:py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-nowrap'>{category}</p>
      </td>
      <td className='px-3 py-3 md:px-5 md:py-5 border-b border-gray-200 bg-white text-sm'>
        <p className={`whitespace-nowrap font-semibold ${status === 'accepted' ? 'text-green-600' : 'text-yellow-600'}`}>
          {status}
        </p>
      </td>
      <td className='px-3 py-3 md:px-5 md:py-5 border-b border-gray-200 bg-white text-sm'>
        <Link 
          to={`/dashboard/submissions/${_id}`}
          className="text-blue-500 hover:text-blue-700 hover:underline whitespace-nowrap"
        >
          See Submissions
        </Link>
      </td>

      <td className='px-3 py-3 md:px-5 md:py-5 border-b border-gray-200 bg-white text-sm'>
        <span
          onClick={openModal}
          className='relative cursor-pointer inline-block px-3 py-1 font-semibold text-red-900 leading-tight transition-transform active:scale-95'
        >
          <span
            aria-hidden='true'
            className='absolute inset-0 bg-red-200 opacity-50 rounded-full'
          ></span>
          <span className='relative whitespace-nowrap'>Delete</span>
        </span>
        <DeleteModal isOpen={isOpen} closeModal={closeModal} id={_id} />
      </td>
      <td className='px-3 py-3 md:px-5 md:py-5 border-b border-gray-200 bg-white text-sm'>
        <span
          onClick={() => setIsEditModalOpen(true)}
          className='relative cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight transition-transform active:scale-95'
        >
          <span
            aria-hidden='true'
            className='absolute inset-0 bg-green-200 opacity-50 rounded-full'
          ></span>
          <span className='relative whitespace-nowrap'>Edit</span>
        </span>
        <UpdatePlantModal
          isOpen={isEditModalOpen}
          setIsEditModalOpen={setIsEditModalOpen}
          contest={contest}
        />
      </td>
    </tr>
  )
}

export default PlantDataRow