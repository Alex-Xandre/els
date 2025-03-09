import React, { useMemo } from 'react';
import { Sidebar } from './sidebar/Sidebar';
import Container from '@/components/container';
import { useAuth } from '@/stores/AuthContext';
import { BellIcon, Hourglass } from 'lucide-react';
import { LeftCalendar } from './LeftCalendar';
import { useCourse } from '@/stores/CourseContext';
import CourseCard from './course-card';
import { useFetchAndDispatch } from '@/helpers/useFetch';
import { getAllCourses, getAllModules, getAllSections, getStudentProgress } from '@/api/course.api';
import { getAllAssessment, getSubmisions } from '@/api/assessment-api';
import { getAllTimeline, getAllUser } from '@/api/get.info.api';
import ReusableTable from '@/components/reusable-table';
import NavContainer from '@/components/nav-container';
import Title from '@/components/ui/title';
import { Button } from '@/components/ui/button';
import { Doughnut } from 'react-chartjs-2';

const Home = () => {
  const { user, allUser } = useAuth();

  const { courses, activity, modules, sections, submissions, progress } = useCourse();

  useFetchAndDispatch(getAllSections, 'SET_SECTIONS');
  useFetchAndDispatch(getAllModules, 'SET_MODULES');
  useFetchAndDispatch(getAllCourses, 'SET_COURSES');
  useFetchAndDispatch(getAllAssessment, 'SET_ACTIVITY');
  useFetchAndDispatch(getAllTimeline, 'GET_ALL_TIMELINES');
  useFetchAndDispatch(getStudentProgress, 'SET_PROGRESS', user._id);
  useFetchAndDispatch(getSubmisions, 'SET_SUBMISSION');
  useFetchAndDispatch(getAllUser, 'GET_ALL_USER');


  // Chart.js options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false, // Disables tooltips on hover
      },
    },
    hover: {
      mode: null, // Disables hover interactions
    },
  };

  const columns = useMemo(
    () => [
      { header: 'Student Name', accessor: 'name' },
      { header: 'Overall Progress', accessor: 'overall' },
      ...courses.map((x) => ({
        header: x.title,
        accessor: `_id${x._id}`,
        // Add custom render function directly
        render: (value) => {
          if (!value) {
            return;
          }
          const [completedLessons = '0', total = '0'] = value.split(' / ');
          const progress = parseInt(completedLessons);
          const totalLessons = parseInt(total);

          let textColor = '#FF0000';

          // Determine text color based on progress
          if (progress === totalLessons && totalLessons !== 0) {
            textColor = '#008000';
          }

          const completionPercentage = totalLessons > 0 ? (progress / totalLessons) * 100 : 0;

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

          return (
            <span className='flex flex-col'>
              <div className='flex items-center gap-x-3'>
                <p className='text-xs '>{completionPercentage.toFixed(2)} % </p>
                <div className='relative h-6 w-6 inline-flex self-end items-center gap-x-2'>
                  <Doughnut
                    data={chartData}
                    options={chartOptions}
                  />
                </div>
              </div>
              <div className=' mt-1 flex flex-row'>
                <h1
                  style={{ color: textColor }}
                  className=''
                >
                  {progress} &nbsp;
                </h1>
                <p> / {total} Completed</p>
              </div>
            </span>
          );
        },
      })),
      { header: '', accessor: 'status' },
    ],
    [courses]
  );

  console.log(columns);
  return (
    <Container>
      <nav className='inline-flex items-center justify-between w-full pr-4 '>
        <div className='m-0'>
          <h1 className='text-2xl'> 👋 Hi there, {user?.personalData?.firstName} </h1>
          <h2 className='text-xs ml-10'>Here is the summary of your activity</h2>
        </div>

        <div className='flex items-center space-x-2'>
          <img
            src={user.profile}
            className='h-8 w-8'
          />
          <span className=' p-1 py-2 '>
            <BellIcon className='h-4' />
          </span>
        </div>
      </nav>

      <section className='w-full mt-5 flex flex-wrap content-start items-start'>
        <div className='w-full gap-3 flex flex-wrap mr-72'>
          <h1 className='text-sm font-semibold w-full'>My Modules</h1>

          {courses.map((course) => {
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

            return (
              <CourseCard
                key={course._id}
                course={course}
                totalSections={totalSections}
                totalActivities={totalActivities}
                completedLessons={0}
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

          <div className='border mx-5 pb-5 rounded-md mt-5 '>
            <h1 className='text-sm font-semibold w-full p-3'>To Grade</h1>
            {submissions.filter((x) => x.isGraded === false).length === 0 ? (
              <h2 className='px-3 text-sm'> ❌ All submissions Graded </h2>
            ) : (
              <h2 className='px-1 text-sm border mx-3 rounded py-1 flex items-center '>
                <Hourglass className='h-5 text-red-600' />
                {submissions.filter((x) => !x.isGraded).length} Submissions
              </h2>
            )}
          </div>
        </div>

        <div className='relative flex flex-col h-1/2 w-full mr-72 mt-5'>
          <ReusableTable
            tableHeader={
              <NavContainer>
                <h1 className='text-sm font-semibold w-full p-2'>Student Progress</h1>
                <Button>View More Details</Button>
              </NavContainer>
            }
            data={allUser
              .filter((x) => x.role === 'user')
              .map((item) => {
                //overall progress
                const studentProgress = progress.find((x) => x.studentId === item._id);
                const completedLessons = studentProgress?.completedLessons?.length || 0;
                const totalItems = activity.length + sections.length;
                const completionPercentage = totalItems > 0 ? (completedLessons / totalItems) * 100 : 0;

                //per module?
                // Loop through all courses for the user
                const userModulesData = courses.map((course) => {
                  const filterModules = modules.filter((x) => (x.courseId as any)?._id === course._id);

                  // Calculate total sections and activities for the filtered modules
                  const totalSections = filterModules.reduce(
                    (sum, module) => sum + sections.filter((x) => x.moduleId?._id === module._id).length,
                    0
                  );

                  const totalActivities = filterModules.reduce(
                    (sum, module) => sum + activity.filter((x) => x.moduleId?._id === module._id).length,
                    0
                  );

                  // Calculate completed lessons for the modules
                  const completedLessonsForCourse = filterModules.reduce((sum, module) => {
                    return (
                      sum +
                        studentProgress?.completedLessons?.filter((lessonId) =>
                          [...sections, ...activity].some(
                            (item) => item._id === lessonId && item.moduleId?._id === module._id
                          )
                        ).length || 0
                    );
                  }, 0);

                  const total = totalSections + totalActivities;
                  return { completedLessonsForCourse, total };
                });

                return {
                  ...item,
                  content: modules.filter((x) => (x.courseId as any)?._id === item._id).length,
                  name: item.personalData?.firstName + ' ' + item.personalData?.lastName,
                  status: (item as any)?.socketId ? 'Online' : 'Offline',
                  overall: completionPercentage === 0 ? '-' : `${completionPercentage.toFixed(2)} %`,
                  ...courses.reduce((acc, course, index) => {
                    acc[`_id${course._id}`] = `${
                      userModulesData[index].completedLessonsForCourse === 0
                        ? '0'
                        : userModulesData[index].completedLessonsForCourse
                    } / ${userModulesData[index].total}`;
                    return acc;
                  }, {}),
                };
              })}
            columns={columns as any}
            title='Invoice'
          />
        </div>
      </section>
    </Container>
  );
};

export default Home;
