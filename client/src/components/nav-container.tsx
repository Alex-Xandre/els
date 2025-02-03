import React, { ReactNode } from 'react';

const NavContainer = ({ children }: { children: ReactNode }) => {
  return <nav className='inline-flex justify-between w-full items-center'>{children}</nav>;
};

export default NavContainer;
