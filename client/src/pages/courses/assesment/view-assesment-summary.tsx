import React from 'react';
import { AssesmentType, QuestionTypes } from '@/helpers/types';
import { Label } from '@/components/ui/label';
import { PencilIcon } from 'lucide-react';

interface PreviewAssesmentI {
  assesment: AssesmentType;
  handleAssesmentChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  hadnleQuestionIndex: (index: number) => void;
}

const PreviewAssessment: React.FC<PreviewAssesmentI> = ({ assesment, hadnleQuestionIndex, handleAssesmentChange }) => {
  const renderQuestion = (question: QuestionTypes, index: number) => {
    switch (question.questionType) {
      case 'multiple-choice':
        return (
          <div
            key={index}
            className='mt-4'
          >
            <p className='font-medium text-base'>{question.questionText}</p>
            <ul className='list-disc pl-5 mt-2'>
              {question.options?.map((option, idx) => (
                <li
                  key={idx}
                  className='text-sm text-gray-700'
                >
                  {option}
                </li>
              ))}
            </ul>
            <p className='text-green-600 mt-2 text-sm'>Correct Answer: {question.correctAnswer}</p>
          </div>
        );
      case 'identification':
        return (
          <div
            key={index}
            className='mt-4'
          >
            <p className='font-medium text-base'>{question.questionText}</p>
            <p className='text-green-600 mt-2 text-sm'>Correct Answer: {question.correctAnswer}</p>
          </div>
        );
      case 'enumeration':
        return (
          <div
            key={index}
            className='mt-4'
          >
            <p className='font-medium text-base'>{question.questionText}</p>
            <p className='text-green-600 mt-2 text-sm'>Correct Answer: {question.correctAnswer}</p>
          </div>
        );
      case 'essay':
        return (
          <div
            key={index}
            className='mt-4'
          >
            <p className='font-medium text-base'>{question.questionText}</p>
            <p className='text-gray-600 mt-2 text-sm'>Explanation: {question.explanation}</p>
          </div>
        );
      default:
        return null;
    }
  };

  const totalPoints = assesment.questions.reduce((total, question) => total + question.questionPoints, 0);

  const difficultyClass = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-500 font-semibold'; // green for easy, adds emphasis
      case 'medium':
        return 'text-yellow-500 font-semibold'; // yellow for medium
      case 'hard':
        return 'text-red-600 font-semibold'; // red for hard
      default:
        return 'text-gray-500'; // default for unknown
    }
  };

  const exclamationMarks = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '!!'; // add more emphasis on easy
      case 'medium':
        return '!'; // medium has moderate emphasis
      case 'hard':
        return ''; // hard doesn't need extra emphasis
      default:
        return '';
    }
  };

  return (
    <section className='w-full flex flex-col gap-y-3 overflow-y-auto h-[calc(100vh-200px)] text-xs pr-3'>
      <div className='bg-white p-6 rounded-lg shadow-lg border border-gray-200'>
        <div className='flex justify-between items-center mb-6'>
          <div className='text-2xl font-semibold text-gray-800'>{assesment.title}</div>
          <div className='text-lg text-gray-500'>{assesment.status}</div>
        </div>

        <p className='text-sm text-gray-600 mb-4'>{assesment.description}</p>

        <div className='grid grid-cols-3 gap-4'>
          <div className='text-sm font-medium text-gray-700'>
            <span className='font-semibold'>Total Points:</span> {totalPoints}
          </div>
          <div className='text-sm font-medium text-gray-700'>
            <span className='font-semibold'>Due Date:</span> {assesment.assesmentDueDate.toLocaleDateString()}
          </div>
          <div className='text-sm font-medium text-gray-700'>
            <span className='font-semibold'>Time Limit:</span> {assesment.timeLimit} minutes
          </div>
        </div>
      </div>

      <div className='mt-8'>
        {assesment.questions.map((question, index) => (
          <div
            key={index}
            className='pb-4 mb-4 border-b'
          >
            <header className='flex justify-between items-center'>
              <Label className='text-lg font-medium'>Question #{index + 1}</Label>
              <span
                className='text-gray-500 hover:text-gray-700 cursor-pointer'
                onClick={() => hadnleQuestionIndex(index)}
              >
                <PencilIcon className='h-5 w-5' />
              </span>
            </header>

            <div className='flex justify-between items-center mt-2'>
              <div className={`text-sm ${difficultyClass(question.difficulty)}`}>
                <span className='font-semibold'>{question.difficulty}</span> {exclamationMarks(question.difficulty)}-{' '}
                <span className='font-semibold'>{question.questionPoints} Points</span>
              </div>
            </div>

            {renderQuestion(question, index)}
          </div>
        ))}
      </div>
    </section>
  );
};

export default PreviewAssessment;
