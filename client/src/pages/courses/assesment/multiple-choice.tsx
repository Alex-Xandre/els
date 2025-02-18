import { Input } from '@/components/ui/input';
import { QuestionTypes } from '@/helpers/types';

import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckIcon, TrashIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
interface MultipleChoiceI {
  question: QuestionTypes;
  index: number;
  onChange: (index: number, field: string, value: string | string[]) => void;
}

const MultipleChoice: React.FC<MultipleChoiceI> = ({ question, index, onChange }) => {
  const handleOptionChange = (optionIndex: number, value: string) => {
    const updatedOptions = [...question.options];
    updatedOptions[optionIndex] = value;
    onChange(index, 'options', updatedOptions);
  };

  const handleAddOption = () => {
    const updatedOptions = [...question.options, ''];
    onChange(index, 'options', updatedOptions);
  };

  const handleRemoveOption = (optionIndex: number) => {
    const updatedOption = question.options.filter((_, i) => i !== optionIndex);
    onChange(index, 'options', updatedOption);
  };

  const handleAnswerChange = (correctAnswer: string) => {
    onChange(index, 'correctAnswer', correctAnswer);
  };

  return (
    <div className='mt-5'>
      <div className='border  my-3 rounded-md flex flex-col'>
        <Label className='w-full font-semibold pt-3 pl-3'>Choices</Label>
        {question.options.map((option, optionIndex) => (
          <div
            key={optionIndex}
            className='bg-white items-center w-full mt-4 p-4 rounded-md inline-flex gap-x-4'
          >
            <Button
              className={`w-fit bg-green-400 rounded-md text-white py-2 px-2 ml-3
                  ${question.correctAnswer !== option && 'opacity-30'}
                  `}
              type='button'
              onClick={() => handleAnswerChange(option)}
            >
              <CheckIcon className='h-4' />
            </Button>

            <Input
              type='text'
              value={option}
              onChange={(e) => handleOptionChange(optionIndex, e.target.value)}
              placeholder={`Choices ${optionIndex + 1}`}
              className='flex !flex-1 !w-full'
            />

            <Button
              className='w-fit bg-red-400 rounded-md text-white px-2 py-2'
              type='button'
              onClick={() => handleRemoveOption(optionIndex)}
            >
              <TrashIcon className='h-4' />
            </Button>
          </div>
        ))}
        <Button
          onClick={handleAddOption}
          variant='default'
          className='w-fit mt-3 ml-3 mb-3'
        >
          Add Choices
        </Button>
      </div>

      <Label className='!mt-5'>Correct Answer</Label>
      <Input
        type='text'
        disabled
        name='description'
        value={question.correctAnswer}
        placeholder='Assesment Description'
      />
    </div>
  );
};

export default MultipleChoice;
