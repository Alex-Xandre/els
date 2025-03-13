import React, { ReactNode } from 'react';
import { useSidebar } from './ui/sidebar';

const Container = ({ children }: { children: ReactNode }) => {
  const { open } = useSidebar();
  return <main className={`  ${!open ? 'ml-16' : 'ml-72'}  relative content-start flex flex-wrap mt-20 pr-5 overflow-y-auto h-[calc(100vh-20px)]`}>{children}</main>;
};

export default Container;