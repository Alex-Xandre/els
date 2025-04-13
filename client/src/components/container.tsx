import React, { ReactNode } from 'react';
import { useSidebar } from './ui/sidebar';

const Container = ({ children }: { children: ReactNode }) => {
  const { open } = useSidebar();
  return (
    <main
      className={`  ${
        !open ? 'ml-16' : ' px-2 ml-12 lg:ml-72'
      }  relative content-start flex flex-wrap mt-5 pt- lg:mt-20 lg:pr-5 overflow-y-auto h-[calc(100vh-20px)]`}
    >
      {children}
    </main>
  );
};

export default Container;
