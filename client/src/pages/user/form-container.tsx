import React, { ReactNode } from 'react';

interface FormContainerI {
  children: ReactNode;
  title: string;
}
const FormContainer: React.FC<FormContainerI> = ({ children, title }) => {
  return (
    <section className=' flex flex-wrap items-center mt-5  justify-start gap-2 border p-4 rounded-md shadow-sm'>
      <h1 className='text-sm font-semibold w-full'> {title}</h1>
      {children}
    </section>
  );
};

export default FormContainer;
