import { FC } from 'react';
import { Eye, Play, CheckCircle, Send } from 'lucide-react';
import { TimelineActivityType } from '@/helpers/types';
import { useCourse } from '@/stores/CourseContext';
import { useAuth } from '@/stores/AuthContext';

// Function to get relative time (e.g., "2 hours ago")
const getTimeAgo = (timestamp: string): string => {
  const now = new Date();
  const past = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  const intervals: { label: string; seconds: number }[] = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }
  return 'just now';
};

// Activity styles with icons and colors
export const activityStyles: Record<TimelineActivityType['activityType'], { icon: JSX.Element; color: string }> = {
  viewed: { icon: <Eye className='text-blue-500 h-4' />, color: 'border-blue-500 text-blue-500' },
  started: { icon: <Play className='text-yellow-500 h-4' />, color: 'border-yellow-500 text-yellow-500' },
  completed: { icon: <CheckCircle className='text-green-500 h-4' />, color: 'border-green-500 text-green-500' },
  submitted: { icon: <Send className='text-purple-500 h-4' />, color: 'border-purple-500 text-purple-500' },
};

// Function to get the title of course/module/section
const getTitle = (id: string, dataArray: { _id: string; title: string }[]) => {
  return dataArray.find((item) => item._id === id)?.title || '';
};

const TimelineCard: FC<{ data: TimelineActivityType }> = ({ data }) => {
  const { icon, color } = activityStyles[data.activityType];

  const { courses, modules, sections } = useCourse();

  // Get dynamic titles if IDs exist
  const courseTitle = data.course ? getTitle(data.course, courses) : '';
  const moduleTitle = data.module ? getTitle(data.module, modules) : '';
  const sectionTitle = data.section ? getTitle(data.section, sections) : '';

  // Build a display text dynamically
  const displayText = [
    courseTitle && `Course: ${courseTitle}`,
    moduleTitle && `Module: ${moduleTitle}`,
    sectionTitle && `Section: ${sectionTitle}`,
  ]
    .filter(Boolean)
    .join(' | ');
  const { allUser, user } = useAuth();
  const [firstWord, ...restWords] = data.text.split(' ');
  const findUser = allUser.find((x) => x._id === data.user);
  return (
    <div className={` m-1 w-full  bg-white`}>
      <div className='inline-flex w-full justify-between mt-1'>
        <span className='inline-flex items-center text-sm gap-x-2'>
          <img
            src={user.role === 'user' ? user.profile : findUser.profile}
            className='h-6 w-6 m-0'
          />
          {user.role === 'user' ? 'You' : `${findUser?.personalData?.firstName} ${findUser?.personalData?.lastName}`}
        </span>
        <p className=' !text-gray-500 text-xs'>{getTimeAgo((data as any)?.createdAt)}</p>
      </div>
      <div className={`flex items-center space-x-3 bg-white  border p-3 rounded-2xl mt-1 relative`}>
        <div className={`border-l-4 ${color} pl-3 `}>
          <div>
            <p className='font-semibold text-sm text-black inline-flex'>
              <div className='w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm'>
                {icon}
              </div>
              <span className={`${color}`}>{firstWord}</span> <span className='ml-2 font-normal'>{restWords.join(' ')}</span>
            </p>
            <p className='text-xs !text-black'>{displayText}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineCard;
