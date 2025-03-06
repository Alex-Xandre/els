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
import { getAllAssessment, getSubmisions } from '@/api/assessment-api';
import ActivityCard from './activity-card';
import { useAuth } from '@/stores/AuthContext';
import PDFView from './single-views/view-pdf';
import VideoView from './single-views/view-video';
import { BarChartIcon, CalendarIcon, CheckIcon, ClockIcon, KeyIcon, XIcon } from 'lucide-react';
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
  const { sections, modules, dispatch, activity, courses, progress, submissions } = useCourse();
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

  const [isInstruction, setIsInstructions] = useState(true);
  const lastItemScore = submissions.length > 0 ? submissions[submissions.length - 1].score : null;
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

                {(currentId as AssesmentType)?.attempts > submissions.length && (
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
                )}
              </>
            )}

            {!isInstruction && submissions.length > 0 ? (
              <>
                <Button
                  className='w-fit text-xs mt-2'
                  onClick={() => {
                    const params = new URLSearchParams(location.search);
                    params.set('examId', currentId._id);
                    const newUrl = `${location.pathname}?${params.toString()}`;

                    navigate(newUrl);
                  }}
                >
                  View Latest Submission
                </Button>
              </>
            ) : !isInstruction ? (
              <p>No submission found</p>
            ) : null}
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
              <h1 className='text-sm'>Score</h1>
              {submissions.length === 0 ? (
                <p className='inline-flex items-center text-xs'>
                  <XIcon className='h-4 text-red-600' /> Nothing submitted yet
                </p>
              ) : (
                <p className='text-xs'>
                  {lastItemScore} / {totalPoints}
                </p>
              )}
            </div>

            <div className='border rounded-md p-3 mt-4 flex flex-col gap-y-2 text-sm'>
              <h1 className='text-sm'>Submissions</h1>

              {submissions.length > 0 && (
                <p>
                  Submitted:{' '}
                  {formatDate.format(
                    new Date(submissions.length > 0 ? submissions[submissions.length - 1].submissionDate : null)
                  )}
                </p>
              )}
              <p>Attempts : {submissions.length}</p>
              <p>Max Attempts : {(currentId as AssesmentType)?.attempts}</p>
              <p className='items-center inline-flex'>
                Allow Late Submission :{' '}
                {(currentId as AssesmentType)?.isLate ? (
                  <CheckIcon className='h-4 text-green-600' />
                ) : (
                  <XIcon className='text-red-600 h-4' />
                )}
              </p>
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

      const params = new URLSearchParams(location.search);

      // Remove any existing 'current' parameters
      params.delete('current');

      // Set the new 'current' value
      params.set('current', nextId);

      // Navigate to the updated URL
      navigate(`${location.pathname}?${params.toString()}`);
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

      const params = new URLSearchParams(location.search);

      // Remove any existing 'current' parameters
      params.delete('current');

      // Set the new 'current' value
      params.set('current', prevId);

      // Navigate to the updated URL
      navigate(`${location.pathname}?${params.toString()}`);
    }
  };

  console.log(submissions);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSubmisions(currentId._id);

        console.log(data);
        if (data.length > 0) {
          setIsInstructions(false);
        }
        // Dispatch to both contexts
        dispatch({ type: 'SET_SUBMISSION', payload: data });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (currentId && !currentId?.sectionType) {
      fetchData();
    }
  }, [dispatch, currentId]);

  const current = params.get('current');

  useEffect(() => {
    if (!current) {
      setCurrentId(null);
    }
    if (current) {
      const findSection: SectionTypes = sections.find((x) => x._id === current);
      const findAssessment: AssesmentType = activity.find((x) => x._id === current);

      if (findSection) {
        setCurrentIndex(organizeSection.indexOf(findSection._id));
        setCurrentId(findSection);
      }

      if (findAssessment) {
        setCurrentIndex(organizeSection.indexOf(findAssessment._id));
        setCurrentId(findAssessment);
      }
    }
  }, [activity, current, organizeSection, sections]);

  if (examId) {
    return <Assessment assessmentProp={currentId} />;
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
                  setCurrentId={() => {
                    setCurrentId(findAssessment);
                    setCurrentIndex(index);
                    navigate(`${location.pathname}${location.search}&current=${findSection._id}`);
                  }}
                />
              );
            } else if (findSection) {
              return (
                <SectionCard
                  setCurrentId={() => {
                    setCurrentId(findSection);
                    setCurrentIndex(index);
                    navigate(`${location.pathname}${location.search}&current=${findSection._id}`);
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
