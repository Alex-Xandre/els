// components/questions/EnumerationQuestion.tsx
import React from 'react';
import { QuestionTypes } from '@/helpers/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
interface EnumerationQuestionProps {
  question: QuestionTypes;
  index: number;
  onChange: (index: number, field: string, value: string | string[]) => void;
}

const EnumerationQuestion: React.FC<EnumerationQuestionProps> = ({ question, index, onChange }) => {
  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const answers = e.target.value.split(',').map((item) => item.trim());
    onChange(index, 'correctAnswer', answers);
  };

 

  return (
    <div>
  
  <Label className='!mt-5'>Correct Answer, separated by comma</Label>
      
      <Input
        type='text'
        value={question.correctAnswer}
        onChange={handleAnswerChange}
        placeholder='e.g. answer 1, answer 2, answer 3'
      />
    </div>
  );
};

export default EnumerationQuestion;
