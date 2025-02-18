import { createSubmission, getAllAssessment } from '@/api/assessment-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AssesmentType } from '@/helpers/types';
import { useFetchAndDispatch } from '@/helpers/useFetch';
import { useCourse } from '@/stores/CourseContext';
import { ClockIcon, GoalIcon, RotateCwIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/stores/AuthContext';

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
  const { activity } = useCourse();

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

  const { questions, title, timeLimit } = assessment;
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
    const res = await createSubmission({
      user: user._id,
      activityId: examId,
      answers: answers,
      submissionDate: new Date(),
      attempts: 1,
      score: totalScore,
      isGraded: 0,
    });
    console.log(res);
    // Handle actual submission logic here
  };

  console.log(answers);

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

  console.log(answers);
  console.log(questions);
  return (
    <div className='flex w-full'>
      {isPreview ? (
        <ScrollArea className='bg-white pr-6 flex-1 w-full rounded-lg overflow-y-auto h-[calc(100vh-100px)]'>
          <h3 className='font-semibold mb-4'>Preview Submission</h3>
          <p className='text-xs mb-5'>Your answers are ready for preview before final submission.</p>

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
                          <span className='text-xs font-semibold'>{isCorrect ? '✔️ Correct' : '❌ Wrong'}</span>
                        </div>
                      </>
                    )}

                    {isEssay && (
                      <div className='flex items-center gap-2 mt-2'>
                        <span className='text-xs font-semibold'>-</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            <div className='mt-4 p-2 border rounded-md'>
              <h2 className='text-lg font-semibold'>Total Score: {totalScore}</h2>
            </div>
          </div>
          {/* 
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
          })} */}

          <Button onClick={handleFinalSubmit}>Submit</Button>
        </ScrollArea>
      ) : (
        <div className='bg-white px-6 rounded-lg flex-1'>
          <h3 className=' font-semibold  text-base'> Item {currentQuestionIndex + 1} </h3>
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

      <div className='border w-1/4 rounded-md p-3 mt-4 flex flex-col gap-y-2 h-fit'>
        {/* Assessment Header */}
        <h1 className='text-sm font-semibold'>{title}</h1>
        <h2 className='text-xs'>{assessment.description}</h2>

        {/* Timer Display */}
        <div className='mt-4'>
          <strong>Time Left:</strong> {formatTime(timeLeft)}
        </div>
      </div>
    </div>
  );
};

export default Assessment;
