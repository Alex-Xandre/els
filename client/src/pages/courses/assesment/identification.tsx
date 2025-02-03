import { Input } from '@/components/ui/input';
import { QuestionTypes } from '@/helpers/types';
import React from 'react';
import { Label } from '@/components/ui/label';
interface MultipleChoiceI {
  question: QuestionTypes;
  index: number;
  onChange: (index: number, field: string, value: string | string[]) => void;
}

const Indentification: React.FC<MultipleChoiceI> = ({ question, index, onChange }) => {
  const handleAnswerChange = (e) => {
    onChange(index, 'correctAnswer', e.target.value);
  };

  return (
    <div>
      <Label className='!mt-5'>Correct Answer</Label>

      <Input
        type='text'
        name='description'
        value={question.correctAnswer}
        onChange={handleAnswerChange}
        placeholder='Correct Answer'
      />
    </div>
  );
};

export default Indentification;
