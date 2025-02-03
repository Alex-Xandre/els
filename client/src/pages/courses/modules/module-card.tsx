import { ModuleTypes } from '@/helpers/types';
import { EyeIcon, PencilIcon } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ModuleCardProps {
  module: ModuleTypes;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module }) => {
  const navigate = useNavigate();
  return (
    <div className='bg-white mr-3 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300'>
      {/* Cover Image */}
      <div className='w-full h-48 overflow-hidden'>
        <img
          src={module.cover || 'https://via.placeholder.com/400x200'}
          alt={module.title}
          className='w-full h-full object-cover'
        />
      </div>

      {/* Content */}
      <div className='p-4'>
        {/* Title */}
        <h2 className='text- font-semibold text-gray-800 mb-2'>{module.title}</h2>

        {/* Description */}
        <p className='text-sm text-gray-600 line-clamp-3'>{module.description}</p>
        <div className='inline-flex w-full justify-end gap-x-2'>
          <span
            onClick={() => navigate(`/${module?.courseId?._id}/new?=${module._id}`)}
            className='p-1 text-green-700 hover:bg-green-700 rounded-md cursor-pointer shadow-sm hover:text-white'
          >
            <PencilIcon className=' h-4' />
          </span>
          <span
            onClick={() => navigate(`/${module?.courseId?._id}/view?=${module._id}`)}
            className='p-1 hover:bg-black rounded-md cursor-pointer shadow-sm hover:text-white'
          >
            <EyeIcon className=' h-4' />
          </span>
        </div>
      </div>
    </div>
  );
};

export default ModuleCard;
