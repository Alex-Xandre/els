import React from 'react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SelectInputI {
  label?: string;
  value: string;
  onValueChange: (val: string) => void;
  options: string[];
  placeholder: string;
}
const SelectInput: React.FC<SelectInputI> = ({  value, onValueChange, options, placeholder }) => {
  return (
    <Select
      value={value}
      onValueChange={onValueChange}
    >
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem
            className='!hover:bg-white'
            value={option}
          >
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SelectInput;
