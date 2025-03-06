import React from 'react';
import { useDateStore } from './utils/useDateStore';
import { Calendar } from '@/components/ui/calendar';

export function LeftCalendar() {
  const { date, setDate } = useDateStore();

  return (
    <div className='flex flex-col items-start space-y-2'>
      <Calendar
        mode='single'
        selected={date}
        onSelect={setDate}
      />
      <h1 className='text-sm px-3'>School Calendar</h1>

      {date && (
        <div className='grid px-3 grid-cols-[auto,1fr] gap-x-2 items-center w-full text-left'>
          <p className='text-4xl font-bold'>{date.getDate()}</p>
          <div className='flex flex-col ml-3'>
            <p className='text-sm'>
              {date.toLocaleString('default', { month: 'long' })} {date.getFullYear()}
            </p>
            <p className='text-sm font-semibold'>{date.toLocaleString('default', { weekday: 'long' })}</p>
          </div>
        </div>
      )}
    </div>
  );
}
