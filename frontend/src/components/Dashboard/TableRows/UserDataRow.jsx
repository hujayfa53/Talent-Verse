import { useState } from 'react'
import UpdateUserRoleModal from '../../Modal/UpdateUserRoleModal'

const UserDataRow = ({ refetch, user }) => {
  let [isOpen, setIsOpen] = useState(false)
  const closeModal = () => setIsOpen(false)
  return (
    <tr>
      <td className='px-3 py-3 sm:px-5 sm:py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-nowrap'>{user?.email}</p>
      </td>
      <td className='px-3 py-3 sm:px-5 sm:py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-nowrap'>{user?.role}</p>
      </td>

      <td className='px-3 py-3 sm:px-5 sm:py-5 border-b border-gray-200 bg-white text-sm'>
        <span
          onClick={() => setIsOpen(true)}
          className='relative cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight transition-transform active:scale-95'
        >
          <span
            aria-hidden='true'
            className='absolute inset-0 bg-green-200 opacity-50 rounded-full'
          ></span>
          <span className='relative whitespace-nowrap'>Update Role</span>
        </span>
        <UpdateUserRoleModal
          isOpen={isOpen}
          closeModal={closeModal}
          role={user?.role}
          user={user}
          refetch={refetch}
        />
      </td>
    </tr>
  )
}

export default UserDataRow