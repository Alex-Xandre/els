import { createOrUpdateSection } from '@/api/course.api';
import { SectionTypes } from '@/helpers/types';
import { useAuth } from '@/stores/AuthContext';
import { useCourse } from '@/stores/CourseContext';
import { EyeIcon, LockIcon, UnlockIcon } from 'lucide-react';
import React from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const SectionCard = ({
  cardData,
  isLocked,
  setCurrentId,
}: {
  cardData: SectionTypes;
  isLocked: boolean;
  setCurrentId?: () => void;
}) => {
  const { title, cover, description = '', moduleId = '', _id, isUnlock } = cardData;

  const navigate = useNavigate();
  const { dispatch } = useCourse();
  const { user } = useAuth();

  const handleChangeStatus = async () => {
    if (window.confirm(`${!isUnlock ? 'Unlock this content?' : 'Lock this content?'}`)) {
      const res = await createOrUpdateSection({ ...cardData, moduleId: cardData.moduleId._id, isUnlock: !isUnlock });
      if (res) {
        dispatch({ type: 'UPDATE_SECTION', payload: res });
        toast.success('Success');
      }
    }
  };

  return (
    <div
      className={`w-full bg-white shadow-sm flex   border  mt-3 rounded-md relative 
    ${
      (isUnlock && user.role === 'admin') || (!isLocked && user.role === 'user')
        ? '!border-r-2 border-r-green-500 '
        : '!border-r-2 border-r-red-500 cursor-not-allowed'
    }
    `}
      onClick={() => {
        if (user.role === 'user' && setCurrentId && !isLocked) {
          setCurrentId();
        }
      }}
    >
      <img
        src={cover}
        className='h-24 w-24'
      />
      <div className=' w-full lg:max-w-1/3 m-0  p-4 overflow-ellipsis  '>
        <h1 className='font-semibold'>{title}</h1>
        <p className='text-xs'> {description}</p>
      </div>

      {user.role === 'admin' && (
        <div className='inline-flex w-full justify-end gap-x-2 p-3'>
          <span
            onClick={handleChangeStatus}
            className='p-1 text-green-700 hover:bg-green-700 h-fit rounded-md cursor-pointer shadow-sm hover:text-white'
          >
            {isUnlock ? <LockIcon className=' h-4' /> : <UnlockIcon className=' h-4 text-red-500 hover:text-white' />}
          </span>

          <span
            onClick={() => navigate(`/${moduleId?._id}/new-lectures?=${_id}`)}
            className='p-1 hover:bg-black rounded-md h-fit cursor-pointer shadow-sm hover:text-white'
          >
            <EyeIcon className=' h-4' />
          </span>
        </div>
      )}
    </div>
  );
};

export default SectionCard;
