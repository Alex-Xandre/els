import { getStudentProgress } from '@/api/course.api';
import { ModuleTypes } from '@/helpers/types';
import { useFetchAndDispatch } from '@/helpers/useFetch';
import { useAuth } from '@/stores/AuthContext';
import { useCourse } from '@/stores/CourseContext';
import { ActivityIcon, BookCheckIcon, EyeIcon, FolderIcon, PencilIcon } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Legend } from 'chart.js';
import { getRandomCover } from '../sections/view-section';
import { registerTimeline } from '@/api/get.info.api';
import { createTimelineData } from '@/helpers/createTimelineData';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

ChartJS.register(ArcElement, Legend);

interface ModuleCardProps {
  module: ModuleTypes;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { activity, sections, progress } = useCourse();

  useFetchAndDispatch(getStudentProgress, 'SET_PROGRESS', user._id);

  const studentProgress = progress.find((item) => item.studentId === user._id);

  const completedLessons =
    studentProgress?.completedLessons?.filter((lessonId) =>
      [...sections, ...activity].some((item) => item._id === lessonId && item.moduleId?._id === module._id)
    ).length || 0;

  const totalSections = sections.filter((x) => x.moduleId?._id === module._id).length;
  const totalActivities = activity.filter((x) => x.moduleId?._id === module._id).length;

  const totalItems = totalSections + totalActivities;
  const completionPercentage = totalItems > 0 ? (completedLessons / totalItems) * 100 : 0;

  // Chart.js data
  const chartData = {
    labels: ['Completed', 'Remaining'],
    datasets: [
      {
        data: [completionPercentage, 100 - completionPercentage],
        backgroundColor: ['#4caf50', '#e0e0e0'],
        borderWidth: 0,
      },
    ],
  };

  // Chart.js options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        display: false, // Disable legend
      },
    },
  };

  const { dispatch } = useAuth();
  return (
    <div
      className='bg-white w-72 mr-3 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300'
      onClick={() => {
        if (user.role === 'user') {
          dispatch(
            registerTimeline(
              createTimelineData({
                user: user._id,
                module: module._id,
                text: `Viewed ${module.title}`,
              })
            )
          );
          navigate(`/${module?.courseId?._id}/view?=${module._id}`);
        }
      }}
    >
      {/* Cover Image */}
      <div className='w-full h-48 overflow-hidden'>
        <img
          src={module.cover !== '' ? module.cover : getRandomCover()}
          alt={module.title}
          className='w-full h-full object-cover'
        />
      </div>



      {/* Content */}
      <div className='p-4'>
        {/* Title */}
        <h2 className='text- font-semibold text-gray-800 mb-2'>{module.title}</h2>

        {/* Description */}

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <p className='text-sm text-gray-600 whitespace-nowrap overflow-ellipsis overflow-hidden w-60 m-0 text-left'>
                {module.description}
              </p>
            </TooltipTrigger>
            <TooltipContent>{module.description}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {/* Admin Controls */}
        {user.role === 'admin' && (
          <div className='inline-flex w-full justify-end gap-x-2'>
            <span
              onClick={() => navigate(`/${module?.courseId?._id}/new?=${module._id}`)}
              className='p-1 text-green-700 hover:bg-green-700 rounded-md cursor-pointer shadow-sm hover:text-white'
            >
              <PencilIcon className='h-4' />
            </span>

            <span
              onClick={() => navigate(`/${module?.courseId?._id}/view?=${module._id}`)}
              className='p-1 hover:bg-black rounded-md cursor-pointer shadow-sm hover:text-white'
            >
              <EyeIcon className='h-4' />
            </span>
          </div>
        )}

        <div className='flex items-center justify-between'>
          {/* Sections */}
          <div>
            {sections.filter((x) => x.moduleId?._id === module._id && x?.isDeleted === false).length > 0 && (
              <span className='inline-flex items-center text-green-900 text-xs'>
                {sections.filter((x) => x.moduleId?._id === module._id && x?.isDeleted === false).length}
                <FolderIcon className='h-3' />
              </span>
            )}

            {/* Activities */}
            {activity.filter((x) => x.moduleId?._id === module._id && x?.isDeleted === false).length > 0 && (
              <span className='inline-flex items-center text-green-900 text-xs'>
                {activity.filter((x) => x.moduleId?._id === module._id && x?.isDeleted === false).length}
                <BookCheckIcon className='h-3' />
              </span>
            )}
          </div>
          {user.role === 'user' && sections.filter((x) => x.moduleId?._id === module._id).length > 0 && (
            <div className='inline-flex items-center gap-x-3'>
              <p className='text-xs '>{completionPercentage.toFixed(2)} % </p>
              <div className='relative h-6 w-6 inline-flex self-end items-center gap-x-2'>
                <Doughnut
                  data={chartData}
                  options={chartOptions}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModuleCard;
