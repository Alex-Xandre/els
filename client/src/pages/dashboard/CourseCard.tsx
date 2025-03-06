import { FolderIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getRandomCover } from '../courses/sections/view-section';
import { registerTimeline } from '@/api/get.info.api';
import { useAuth } from '@/stores/AuthContext';
import { createTimelineData } from '@/helpers/createTimelineData';

interface Course {
  _id: string;
  title: string;
  cover: string;
}

interface CourseCardProps {
  course: Course;
  totalSections: number;
  totalActivities: number;
  completedLessons: number;
  sectionCount: number;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  totalSections,
  totalActivities,
  completedLessons,
  sectionCount,
}) => {
  const nav = useNavigate();
  const { user, dispatch } = useAuth();

  return (
    <div
      className='flex-1 rounded-md border overflow-hidden cursor-pointer'
      key={course._id}
      onClick={() => {
        dispatch(
          registerTimeline(
            createTimelineData({
              user: user._id,
              course: course._id,
              text: `Viewed ${course.title}`,
            })
          )
        );
        nav(`/moduleId?=${course._id}`);
      }}
    >
      <div className='w-full h-48 overflow-hidden'>
        <img
          src={course.cover === '' ? getRandomCover() : course.cover}
          alt={course.title}
          className='w-full h-full object-cover'
        />
      </div>
      <h1 className='p-2 font-semibold text-sm'>{course.title}</h1>
      <span className='inline-flex p-2 items-center text-green-900 text-xs'>
        {sectionCount} Sections
        <FolderIcon className='h-3' />
      </span>
      <p className='text-xs text-gray-600 px-2 pb-2 '>
        {completedLessons} of {totalSections + totalActivities} Completed
        <span> {completedLessons === 0 ? '❌' : '✔️'} </span>
      </p>
    </div>
  );
};

export default CourseCard;
