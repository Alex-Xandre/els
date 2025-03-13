import React from 'react';
import { useDateStore } from './utils/useDateStore';
import { Calendar } from '@/components/ui/calendar';
import { useCourse } from '@/stores/CourseContext';

export function LeftCalendar() {
  const { date, setDate } = useDateStore();
  const { activity } = useCourse();

  const filteredData = activity.filter((item) => {
    const itemDate = new Date(item.assesmentDueDate);
    return (
      itemDate.getFullYear() === date.getFullYear() &&
      itemDate.getMonth() === date.getMonth() &&
      itemDate.getDate() === date.getDate()
    );
  });

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
      {filteredData.length === 0 ? (
        <span className='text-sm ml-3'> ❌ No Activity Due Today</span>
      ) : (
        <div className='flex flex-col px-3 w-full'>
          {filteredData.map((item) => (
            <span className='text-sm border rounded-md w-full p-1'>{item.title}</span>
          ))}
        </div>
      )}
    </div>
  );
}
