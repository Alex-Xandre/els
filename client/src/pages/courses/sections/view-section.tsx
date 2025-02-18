import Container from '@/components/container';
import NavContainer from '@/components/nav-container';
import { AssesmentType, ModuleTypes, SectionTypes } from '@/helpers/types';
import { useCourse } from '@/stores/CourseContext';

import React, { useCallback, useEffect, useState } from 'react';
import Title from '@/components/ui/title';
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  getAllCourses,
  getAllModules,
  getAllSections,
  getSectionOrganization,
  getStudentProgress,
} from '@/api/course.api';
import { useFetchAndDispatch } from '@/helpers/useFetch';
import Breadcrumb from '@/components/bread-crumb';
import SectionCard from './section-card';
import { getAllAssessment } from '@/api/assessment-api';
import ActivityCard from './activity-card';
import { useAuth } from '@/stores/AuthContext';
import PDFView from './single-views/view-pdf';
import VideoView from './single-views/view-video';
import { BarChartIcon, CalendarIcon, ClockIcon, KeyIcon } from 'lucide-react';
import Assessment from './single-views/view-activity';
import { formatDate } from '../assesment/formatTime';

const coverImages = [
  'https://res.cloudinary.com/dgb3br9x6/image/upload/v1737850853/cover1_h28tl3.webp',
  'https://res.cloudinary.com/dgb3br9x6/image/upload/v1737850853/cover2_tqh446.webp',
  'https://res.cloudinary.com/dgb3br9x6/image/upload/v1737850853/cover3_soq0xt.webp',
  'https://res.cloudinary.com/dgb3br9x6/image/upload/v1737850853/cover4_d5j1re.webp',
];

// Utility function to get a random cover image
export const getRandomCover = (): string => {
  const randomIndex = Math.floor(Math.random() * coverImages.length);
  return coverImages[randomIndex];
};

const ViewModule = () => {
  const { sections, modules, activity, courses, progress } = useCourse();
  const [organizeSection, setOrganizeSection] = useState([]);

  const [module, setModule] = useState<ModuleTypes>({
    _id: '',
    title: '',
    description: '',
    cover: '',
    courseId: '',
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const navigate = useNavigate();
  const moduleId = useParams();
  const item = useLocation();

  const searchParams = new URLSearchParams(item.search);
  const myParamValue = searchParams.get('');
  const { user } = useAuth();

  const [currentId, setCurrentId] = useState<AssesmentType | SectionTypes>();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const examId = params.get('examId');

  useFetchAndDispatch(getAllSections, 'SET_SECTIONS');
  useFetchAndDispatch(getAllModules, 'SET_MODULES');
  useFetchAndDispatch(getAllCourses, 'SET_COURSES');
  useFetchAndDispatch(getAllAssessment, 'SET_ACTIVITY');
  useFetchAndDispatch(getStudentProgress, 'SET_PROGRESS', user._id);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getSectionOrganization(myParamValue);
      if (res) {
        setOrganizeSection(res.contentId);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (myParamValue) {
      const items = modules.find((x) => x?._id === myParamValue);
      if (!items) return;

      setModule(modules.find((x) => x?._id === myParamValue));
    }
  }, [modules, item.search]);

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: courses.find((x) => x._id === moduleId?.moduleId)?.title, href: `/moduleId?=${moduleId?.moduleId}` },
    { label: module.title, href: `/moduleId?=${module._id}`, isCurrentPage: true },
  ];

  const [isInstruction, setIsInstructions] = useState(false);

  const renderItems = useCallback(() => {
    if (currentId && !currentId?.sectionType) {
      const activity: AssesmentType = currentId;

      const { title, description, category, assesmentDueDate, questions } = activity;

      const totalPoints = questions.reduce((acc, question) => acc + question.questionPoints, 0);

      return (
        <section className='w-full flex gap-x-3'>
          <div className=' flex-1 rounded-md py-3 mt-4 flex flex-col gap-y-2'>
            <ul className='border-b inline-flex text-sm z-50 -ml-2'>
              <li
                onClick={() => setIsInstructions(true)}
                className={`px-2 ${isInstruction ? ' border-b-[2px] border-primary' : ''}`}
              >
                Instructions
              </li>
              <li
                onClick={() => setIsInstructions(false)}
                className={`px-2 ${!isInstruction ? ' border-b-[2px] border-primary' : ''}`}
              >
                Submissions
              </li>
            </ul>

            {isInstruction && (
              <>
                <h2 className='text-xs'>{description}</h2>

                <Button
                  className='w-fit text-xs'
                  onClick={() => {
                    const params = new URLSearchParams(location.search);
                    params.set('examId', currentId._id);
                    const newUrl = `${location.pathname}?${params.toString()}`;

                    navigate(newUrl);
                  }}
                >
                  Submit Answer
                </Button>
              </>
            )}
          </div>
          <div className='w-1/4 '>
            <div className='border rounded-md p-3 mt-4 flex flex-col gap-y-2'>
              <h1 className='text-sm font-semibold uppercase'>{title} </h1>

              <h3 className='text-sm items-center inline-flex border-b pb-1.5'>
                <KeyIcon className='h-4 text-green-600' />
                Type {category}
              </h3>

              <h3 className='text-sm items-center inline-flex border-b pb-1.5 '>
                <BarChartIcon className='h-4 text-[#5221DE]' />
                Max Score {totalPoints}
              </h3>

              <h3 className='text-sm items-center inline-flex border-b pb-1.5 '>
                <ClockIcon className='h-4 !text-[#DE5221]' />
                Time Limit{' '}
                {(currentId as AssesmentType)?.timeLimit
                  ? (currentId as AssesmentType)?.timeLimit + '  minutes'
                  : 'No Time Limit'}
              </h3>

              <h3 className='text-sm items-center inline-flex  pb-1.5 '>
                <CalendarIcon className='h-4 text-yellow-600' />
                Due {formatDate.format(new Date(assesmentDueDate))}
              </h3>
            </div>

            <div className='border rounded-md p-3 mt-4 flex flex-col gap-y-2'>
              <h1 className='text-sm'>Submissions</h1>
            </div>
          </div>
        </section>
      );
    }
    switch (currentId?.sectionType) {
      case 'pdf':
      case 'word':
      case 'excel':
        return <PDFView currentId={currentId as SectionTypes} />;
      case 'video':
        return <VideoView currentId={currentId as SectionTypes} />;
      default:
        return null;
    }
  }, [currentId, isInstruction]);

  const handleNext = () => {
    if (currentIndex < organizeSection.length - 1) {
      const nextId = organizeSection[currentIndex + 1];
      const nextItem = sections.find((x) => x._id === nextId) || activity.find((x) => x._id === nextId);

      // Check if next item is unlocked
      const isUnlocked = nextItem?.isUnlock || progress?.[0]?.completedLessons?.includes(nextItem?._id);

      // if (isUnlocked) {
      //   setCurrentId(nextItem);
      //   setCurrentIndex(currentIndex + 1);
      // }

      setCurrentId(nextItem);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevId = organizeSection[currentIndex - 1];
      const prevItem = sections.find((x) => x._id === prevId) || activity.find((x) => x._id === prevId);

      // Disable previous button if at the start (index 0)
      const isUnlocked =
        currentIndex === 0 || progress?.includes(organizeSection[currentIndex - 1]) || prevItem?.isUnlock;

      // if (isUnlocked || currentIndex === 1) {
      setCurrentId(prevItem);
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (examId) {
    return (
      <Container>
        <Assessment assessmentProp={currentId} />
      </Container>
    );
  }

  return (
    <Container>
      <NavContainer>
        <Title text={module?.title} />
        {user.role === 'admin' && (
          <div className='inline-flex gap-x-2'>
            <Button onClick={() => navigate(`/${myParamValue}/new-assesment`)}>Add Activity</Button>
            <Button
              variant='secondary'
              onClick={() => navigate(`/${myParamValue}/new-lectures`)}
            >
              Add Lectures
            </Button>
          </div>
        )}
      </NavContainer>

      <Breadcrumb items={breadcrumbItems} />

      {currentId ? (
        <>
          <header className='inline-flex items-center justify-between w-full mt-5'>
            <Button
              className={currentIndex === 0 ? 'cursor-not-allowed opacity-35' : ''}
              onClick={handlePrevious}
            >
              Previous
            </Button>

            <Button
              className={
                currentIndex === organizeSection.length - 1 && currentIndex !== 0 ? 'cursor-not-allowed opacity-35' : ''
              }
              onClick={handleNext}
            >
              Next
            </Button>
          </header>
          {renderItems()}
        </>
      ) : (
        <>
          {organizeSection.map((item, index) => {
            const findSection: SectionTypes = sections.find((x) => x._id === item);
            const findAssessment: AssesmentType = activity.find((x) => x._id === item);

            const prevItem = organizeSection[index - 1];
            const isUnlocked =
              index === 0 ||
              (prevItem && Array.isArray(progress) && progress?.[0]?.completedLessons.includes(findSection?._id)) ||
              progress?.[0]?.completedLessons.includes(findAssessment?._id) ||
              findSection?.isUnlock;

            if (findAssessment) {
              return (
                <ActivityCard
                  key={findAssessment._id}
                  cardData={findAssessment}
                  isLocked={!isUnlocked}
                />
              );
            } else if (findSection) {
              return (
                <SectionCard
                  setCurrentId={() => {
                    setCurrentId(findSection);
                    setCurrentIndex(index);
                  }}
                  key={findSection._id}
                  isLocked={!isUnlocked}
                  cardData={{ ...findSection, cover: findSection.cover === '' ? getRandomCover() : findSection.cover }}
                />
              );
            }
          })}
        </>
      )}
    </Container>
  );
};

export default ViewModule;
