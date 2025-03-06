import { getAllAssessment } from '@/api/assessment-api';
import { getAllCourses, getAllModules, getAllSections, getStudentProgress } from '@/api/course.api';
import Container from '@/components/container';
import { useFetchAndDispatch } from '@/helpers/useFetch';
import { useAuth } from '@/stores/AuthContext';
import { useCourse } from '@/stores/CourseContext';
import { BellIcon, FolderIcon, InfoIcon } from 'lucide-react';
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { getRandomCover } from '../courses/sections/view-section';
import { useNavigate } from 'react-router-dom';
import CourseCard from './CourseCard';
import { getAllTimeline } from '@/api/get.info.api';
import TimelineCard from './TimelineCard';
import { LeftCalendar } from './LeftCalendar';

const HomeStudent = () => {
  const { user, allTimelines } = useAuth();
  const { sections, modules, dispatch, activity, courses, progress, submissions } = useCourse();

  useFetchAndDispatch(getAllSections, 'SET_SECTIONS');
  useFetchAndDispatch(getAllModules, 'SET_MODULES');
  useFetchAndDispatch(getAllCourses, 'SET_COURSES');
  useFetchAndDispatch(getAllAssessment, 'SET_ACTIVITY');
  useFetchAndDispatch(getAllTimeline, 'GET_ALL_TIMELINES');
  useFetchAndDispatch(getStudentProgress, 'SET_PROGRESS', user._id);

  console.log(allTimelines);

  const studentProgress = progress.find((item) => item.studentId === user._id);

  const completedLessons = studentProgress?.completedLessons?.length || 0;

  const totalItems = activity.length + sections.length;
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
        display: false,
      },
    },
  };

  console.log(allTimelines);

  return (
    <Container>
      <nav className='inline-flex items-center justify-between w-full pr-4 '>
        <div className='m-0'>
          <h1> 👋 Hi there, {user?.personalData?.firstName} </h1>
          <h2 className='text-xs'>Here is the summary of your activity</h2>
        </div>

        <div className='flex items-center space-x-2'>
          <img
            src={user.profile}
            className='h-8 w-8'
          />
          <span className=' p-1 py-2 bg-sky-100 rounded'>
            <BellIcon className='h-4' />
          </span>
        </div>
      </nav>

      <section className='w-full mt-5 flex flex-wrap content-start items-start'>
        <div className='w-full gap-3 flex flex-wrap mr-72'>
          <h1 className='text-sm font-semibold w-full'>My Progress</h1>
          <div className='w-1/3 p-6 rounded-md border relative'>
            <h1 className='text-2xl font-bold text-gray-800'>
              {completedLessons} / {activity.length + sections.length}
            </h1>
            <h2 className='text-sm text-gray-500'>Completed lessons and activities</h2>

            <div className='relative mt-6 h-24 w-24 flex items-center justify-center'>
              <Doughnut
                data={chartData}
                options={chartOptions}
              />
              <p className='absolute text-sm font-bold text-gray-700'>{completionPercentage.toFixed(2)}%</p>
            </div>

            <h2 className='absolute bottom-5 left-6 text-sm text-gray-600 flex items-center gap-2'>
              <InfoIcon className='h-5 text-sky-500' />
              Overall Progress of all modules
            </h2>
          </div>

          {courses.slice(0, 3).map((course) => {
            const filterModules = modules.filter((x) => (x.courseId as any)?._id === course._id);

            // Calculate total sections and activities for all modules in this course
            const totalSections = filterModules.reduce(
              (sum, module) => sum + sections.filter((x) => x.moduleId?._id === module._id).length,
              0
            );

            const totalActivities = filterModules.reduce(
              (sum, module) => sum + activity.filter((x) => x.moduleId?._id === module._id).length,
              0
            );

            const completedLessons = filterModules.reduce((sum, module) => {
              return (
                sum +
                  studentProgress?.completedLessons?.filter((lessonId) =>
                    [...sections, ...activity].some(
                      (item) => item._id === lessonId && item.moduleId?._id === module._id
                    )
                  ).length || 0
              );
            }, 0);

            return (
              <CourseCard
                key={course._id}
                course={course}
                totalSections={totalSections}
                totalActivities={totalActivities}
                completedLessons={completedLessons}
                sectionCount={filterModules.length}
              />
            );
          })}
        </div>

        <div className=' absolute right-4'>
          <div className='border mx-5 pb-5 rounded-md '>
            <h1 className='text-sm font-semibold w-full p-3'>School Calendar</h1>
            <LeftCalendar />
          </div>

          <div className='border mx-5 pb-5 rounded-md mt-5 '>
            <h1 className='text-sm font-semibold w-full p-3'>Upcoming</h1>
            <h2 className='px-3 text-sm'> ❌ No Upcoming Activities </h2>
          </div>
        </div>

        <div className='relative flex flex-col h-1/2 w-full mr-72 mt-5 '>
          <h1 className='text-sm font-semibold w-full mb-5'>My Activities </h1>
          {allTimelines.map((x, index) => (
            <div
              key={index}
              className='relative flex w-full '
            >
              <img
                src={user.profile}
                className='h-8 w-8'
              />
              {/* Vertical Thread Line */}
              <div className='flex flex-col items-center w-10 relative'>
                {/* Top Connecting Line (if not the first item) */}
                {index !== 0 && <div className='w-1 bg-sky-100 flex-grow min-h-[20px]'></div>}

                {/* Thread Node (Circle) */}
                <div className='w-3 h-3 bg-sky-100 rounded-full relative'>
                  {/* Horizontal Line (Attached to Circle) */}
                  <div className='absolute left-full top-1/2 transform -translate-y-1/2 w-6 h-1 bg-sky-100'></div>
                </div>

                {/* Bottom Connecting Line (if not the last item) */}
                {index !== allTimelines.length - 1 && <div className='w-1 bg-sky-100 flex-grow min-h-[40px]'></div>}
              </div>

              {/* Content */}
              <div className='flex items-center space-x-4 w-full'>
                <TimelineCard data={x} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </Container>
  );
};

export default HomeStudent;
