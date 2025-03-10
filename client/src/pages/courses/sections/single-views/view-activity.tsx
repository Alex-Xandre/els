import { createSubmission, getAllAssessment, getSubmisions } from '@/api/assessment-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AssesmentType, SubmissionType } from '@/helpers/types';
import { useFetchAndDispatch } from '@/helpers/useFetch';
import { useCourse } from '@/stores/CourseContext';
import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/stores/AuthContext';
import { useSidebar } from '@/components/ui/sidebar';
import { BarChartIcon, CalendarIcon, CheckIcon, ClockIcon, KeyIcon, XIcon } from 'lucide-react';
import { formatDate } from '../../assesment/formatTime';

const Assessment = ({ assessmentProp }) => {
  const [assessment, setAssessment] = useState<AssesmentType>(
    assessmentProp || {
      _id: '',
      title: '',
      description: '',
      questions: [],
      moduleId: '',
      assesmentDueDate: new Date(),
      timeLimit: 60,
      status: 'draft',
      category: '',
      attempts: 1,
    }
  );

  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const examId = params.get('examId');
  const { activity, submissions } = useCourse();

  const subId = params.get('');
  useFetchAndDispatch(getAllAssessment, 'SET_ACTIVITY');

  useEffect(() => {
    if (examId) {
      const item = activity.find((x) => x._id === examId);
      if (!item) return;

      setAssessment(item);
    }
  }, [activity, examId]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(assessment?.timeLimit * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  // State to store answers for each question
  const [answers, setAnswers] = useState(
    assessment.questions.reduce((acc, question) => {
      acc[question._id] = '';
      return acc;
    }, {})
  );

  const { questions, title } = assessment;
  const totalPoints = questions.reduce((acc, question) => acc + question.questionPoints, 0);

  // Timer logic

  useEffect(() => {
    if (isSubmitted || isPreview) return;

    const timerInterval = setInterval(() => {
      if (timeLeft > 0) {
        setTimeLeft(timeLeft - 1);
      } else {
        clearInterval(timerInterval);
        setIsSubmitted(true);
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [timeLeft, isSubmitted, isPreview]);

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    setIsPreview(true);
  };

  const { user } = useAuth();

  const handleFinalSubmit = async () => {
    const totalScoreChecked: any = Object.values(scores).reduce((sum: any, score: any) => sum + score, 0);

    const res = await createSubmission({
      _id: subId || '',
      ...(user.role === 'user' && { user: user._id }),
      activityId: examId,
      answers: answers,
      submissionDate: new Date(),
      attempts: 1,
      ...(user.role === 'admin' && { scores:scores }),
      score: user.role === 'admin' ? totalScoreChecked : totalScore,
      isGraded: user.role === 'admin' ? true : false,
    });

    setIsSubmitted(true);

    navigate(-1)
    // Handle actual submission logic here
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const totalScore = questions.reduce((score, question) => {
    const userAnswer = (answers[question._id] || '').toString().trim().toLowerCase();
    const correctAnswer = Array.isArray(question.correctAnswer)
      ? question.correctAnswer
          .map((ans) => ans.toLowerCase())
          .sort()
          .join(', ')
      : question.correctAnswer.toString().trim().toLowerCase();

    if (question.questionType === 'essay') return score;

    const isCorrect = userAnswer === correctAnswer;
    return isCorrect ? score + question.questionPoints : score;
  }, 0);
  const lastItemScore = submissions.length > 0 ? submissions[submissions.length - 1].score : null;
  const renderQuestionInput = (question) => {
    if (!question) {
      return null;
    }
    const answer = answers[question._id] || '';

    switch (question.questionType) {
      case 'multiple-choice':
        return (
          <div className='space-y-3'>
            {question.options.map((option, index) => (
              <div
                key={index}
                className='flex items-center'
              >
                <input
                  type='radio'
                  id={option}
                  name={`answer-${question._id}`}
                  className='mr-2'
                  checked={answer === option}
                  onChange={() => handleAnswerChange(question._id, option)}
                />
                <label htmlFor={option}>{option}</label>
              </div>
            ))}
          </div>
        );
      case 'enumeration':
        return (
          <div className='space-y-3'>
            <Textarea
              value={answer}
              onChange={(e) => handleAnswerChange(question._id, e.target.value)}
              placeholder='Type your answer here'
            />
          </div>
        );
      case 'identification':
        return (
          <div className='space-y-3'>
            <Input
              type='text'
              value={answer}
              onChange={(e) => handleAnswerChange(question._id, e.target.value)}
              placeholder='Type your answer'
            />
          </div>
        );
      case 'essay':
        return (
          <div className='space-y-3'>
            <Textarea
              value={answer}
              onChange={(e) => handleAnswerChange(question._id, e.target.value)}
              placeholder='Write your essay here'
            />
          </div>
        );
      default:
        return null;
    }
  };

  const { open } = useSidebar();

  // useEffect(() => {
  //   const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  //     const message = 'Are you sure you want to leave? Your progress may be lost and this will be submitted!';
  //     event.preventDefault();
  //     event.returnValue = message;
  //     return message;
  //   };

  //   const handlePopState = () => {
  //     if (window.confirm('Are you sure you want to leave? Your progress may be lost and this will be submitted!')) {
  //       handleUserConfirmedExit();
  //       return;
  //     } else {
  //       // Push state again to prevent back navigation
  //       // window.history.pushState(null, '', window.location.href);
  //     }
  //   };

  //   if (assessment.attempts > submissions.length) {
  //     // Push initial state to prevent immediate back navigation
  //     window.history.pushState(null, '', window.location.href);

  //     window.addEventListener('beforeunload', handleBeforeUnload);
  //     window.addEventListener('popstate', handlePopState);
  //   }

  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //     window.removeEventListener('popstate', handlePopState);
  //   };
  // }, []);

  const navigate = useNavigate();

  // External function to handle user confirmation
  const handleUserConfirmedExit = async () => {
    if (user.role === 'admin') {
      navigate(-1);
      return;
    }
    const res = await createSubmission({
      user: user._id,
      activityId: examId,
      answers: answers,
      submissionDate: new Date(),
      attempts: 1,
      score: totalScore,
    
      isGraded: false,
    });
    navigate(-1);
  };

  useEffect(() => {
    if (submissions.length >= assessment.attempts || submissions.length > 0) {
      setIsSubmitted(true);
      setIsPreview(true);

      setAnswers(submissions[submissions.length - 1].answers);
      if (submissions[submissions.length - 1]?.scores) {
        setScores(submissions[submissions.length - 1]?.scores);
      } else {
        if (assessment?.questions?.length) {
          setScores(
            assessment.questions.reduce((acc, question) => {
              const userAnswer = answers[question._id];
              acc[question._id] =
                userAnswer === question.correctAnswer && question.questionType !== 'essay'
                  ? question.questionPoints
                  : 0;
              return acc;
            }, {})
          );
        }
      }
    }
  }, [assessment]);

  const [scores, setScores] = useState({});

  // Function to update scores manually
  const handleScoreChange = (questionId, newScore) => {
    setScores((prevScores) => ({
      ...prevScores,
      [questionId]: Number(newScore), // Ensure numeric value
    }));
  };

  

  return (
    <main className={`  ${!open ? 'pl-16' : 'pl-72'} inset-0 z-50  absolute flex flex-wrap mt-20 pr-5`}>
      <div className='flex w-full '>
        {isPreview ? (
          <ScrollArea className='bg-white pr-6 flex-1 w-full rounded-lg overflow-y-auto h-[calc(100vh-100px)]'>
            <h3 className='font-semibold mb-4'>Preview Submission</h3>
            <p className='text-xs mb-5'>Your answers are ready for preview before final submission.</p>

            {isSubmitted && (
              <div>
                {questions.map((question, index) => {
                  const userAnswer = (answers[question._id] || '').toString().trim().toLowerCase();
                  const correctAnswer = Array.isArray(question.correctAnswer)
                    ? question.correctAnswer
                        .map((ans) => ans.toLowerCase())
                        .sort()
                        .join(', ')
                    : question.correctAnswer.toString().trim().toLowerCase();

                  const isEssay = question.questionType === 'essay';
                  const isCorrect = !isEssay && userAnswer === correctAnswer;

                  return (
                    <div
                      key={question._id}
                      className='mb-4 border w-full p-2 rounded-md'
                    >
                      <h4 className='text-sm font-semibold'>{`Question ${index + 1}: ${question.questionText}`}</h4>
                      <div className='mt-2'>
                        <h2 className='text-xs'>Your Answer:</h2>
                        <p className='text-xs'>{answers[question._id] || 'No answer provided'}</p>

                        {!isEssay && (
                          <>
                            <h2 className='text-xs mt-2'>Correct Answer:</h2>
                            <p className='text-xs'>
                              {Array.isArray(question.correctAnswer)
                                ? question.correctAnswer.join(', ')
                                : question.correctAnswer}
                            </p>

                            <div className='flex items-center gap-2 mt-2'>
                              <span className='text-xs font-semibold'>
                                {isCorrect ? `✔️ Correct ` : '❌ Wrong'}
                                <span className='font-normal'>
                                  {isCorrect ? ` -  ${question.questionPoints} points` : ''}
                                </span>
                              </span>
                            </div>
                          </>
                        )}

                        {(isEssay || question.questionType === 'enumeration') && (
                          <div className='flex flex-col w-1/2 gap-2 mt-2'>
                            <span className='text-xs font-semibold m-0'>
                              {scores?.[question._id]} - Max Score {question.questionPoints}
                            </span>

                            {user.role === 'admin' && (
                              <Input
                                placeholder='Add Score'
                                value={scores?.[question._id] || ''}
                                onChange={(e) => handleScoreChange(question._id, e.target.value)}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {user.role === 'admin' && <Button onClick={handleFinalSubmit}>Submit Grading</Button>}
              </div>
            )}

            {!isSubmitted && (
              <>
                {questions.map((question, index) => {
                  const answer = answers[question._id] || '';
                  return (
                    <div
                      key={question._id}
                      className='mb-4 border w-full p-2 roundedmd'
                    >
                      <h4 className='text-sm font-semibold'>{`Question ${index + 1}: ${question.questionText}`}</h4>
                      <div className='mt-2'>
                        <h2 className='text-xs'>Your Answer:</h2>
                        <p className='text-xs'>{answer || 'No answer provided'}</p>
                      </div>
                    </div>
                  );
                })}
                <Button onClick={handleFinalSubmit}>Submit</Button>
              </>
            )}
          </ScrollArea>
        ) : (
          <div className='bg-white px-6 rounded-lg flex-1'>
            <h3 className=' font-semibold  text-base w-full justify-between inline-flex'>
              {' '}
              Item {currentQuestionIndex + 1}{' '}
              <span className='text-sm italic font-normal'>
                {questions[currentQuestionIndex]?.questionPoints} points
              </span>
            </h3>
            <h4 className='mb-5 text-sm'> {questions[currentQuestionIndex]?.questionText}</h4>

            {renderQuestionInput(questions[currentQuestionIndex])}

            <div className='flex justify-between mt-4'>
              <Button
                onClick={handlePrev}
                disabled={currentQuestionIndex === 0 || isSubmitted}
              >
                Prev
              </Button>
              <Button
                onClick={currentQuestionIndex === questions.length - 1 ? handleSubmit : handleNext}
                disabled={isSubmitted}
              >
                {currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Next'}
              </Button>
            </div>
          </div>
        )}

        {isSubmitted ? (
          <div className=' w-1/4 '>
            <div className='border rounded-md p-3 mt-4 flex flex-col gap-y-2'>
              <h1 className='text-sm font-semibold uppercase'>{title} </h1>

              <h3 className='text-sm items-center inline-flex border-b pb-1.5'>
                <KeyIcon className='h-4 text-green-600' />
                Type {assessment.category}
              </h3>

              <h3 className='text-sm items-center inline-flex border-b pb-1.5 '>
                <BarChartIcon className='h-4 text-[#5221DE]' />
                Max Score {totalPoints}
              </h3>

              <h3 className='text-sm items-center inline-flex border-b pb-1.5 '>
                <ClockIcon className='h-4 !text-[#DE5221]' />
                Time Limit {assessment?.timeLimit ? assessment?.timeLimit + '  minutes' : 'No Time Limit'}
              </h3>

              <h3 className='text-sm items-center inline-flex  pb-1.5 '>
                <CalendarIcon className='h-4 text-yellow-600' />
                Due {formatDate.format(new Date(assessment?.assesmentDueDate))}
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
              <p>Max Attempts : {assessment?.attempts}</p>
              <p className='items-center inline-flex'>
                Allow Late Submission :{' '}
                {(assessment as AssesmentType)?.isLate ? (
                  <CheckIcon className='h-4 text-green-600' />
                ) : (
                  <XIcon className='text-red-600 h-4' />
                )}
              </p>
            </div>
          </div>
        ) : (
          <div className='border w-1/4 rounded-md p-3 mt-4 flex flex-col gap-y-2 h-fit'>
            {/* Assessment Header */}
            <h1 className='text-sm font-semibold'>{title}</h1>
            <h2 className='text-xs'>{assessment.description}</h2>

            {/* Timer Display */}
            <div className='mt-4'>
              <strong>Time Left:</strong> {formatTime(timeLeft)}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Assessment;
