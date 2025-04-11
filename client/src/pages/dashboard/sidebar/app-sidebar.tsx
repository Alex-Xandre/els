import * as React from 'react';
import { AppWindowIcon, BookOpen, LogOutIcon, PanelLeft, RefreshCcw, UserIcon, XIcon } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';
import { NavMain } from './nav-main';
import { Button } from '@headlessui/react';
import { useAuth } from '@/stores/AuthContext';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '@/api/login';
import { useCourse } from '@/stores/CourseContext';
import { useFetchAndDispatch } from '@/helpers/useFetch';
import { getAllCourses } from '@/api/course.api';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { toggleSidebar, open } = useSidebar();
  const { dispatch, user } = useAuth();
  const nav = useNavigate();
  const { courses } = useCourse();

  useFetchAndDispatch(getAllCourses, 'SET_COURSES');

  const onLogout = async () => {
    sessionStorage.removeItem('token');
    dispatch({ type: 'SIGNOUT' });
    logoutUser();
    nav('/');
  };

  // This is sample data.
  const data = {
    user: {
      name: 'shadcn',
      email: 'm@example.com',
      avatar: '/avatars/shadcn.jpg',
    },

    navMain: [
      {
        title: 'Home',
        url: '/',
        icon: AppWindowIcon,
        isActive: true,
        isDropdown: true,
      },
      {
        title: 'Modules',
        id: 'modules',
        url: '/courses',
        icon: BookOpen,
        items: courses.map((x) => {
          return {
            url: `/moduleId?=${x._id}`,
            title: x.title,
            _id: x._id,
          };
        }),
      },

      ...(user.role === 'admin'
        ? [
            {
              title: 'Scores',
              url: '/progress',
              icon: RefreshCcw,
              isDropdown: true,
            },
          ]
        : []),
      ...(user.role === 'admin'
        ? [
            {
              title: 'Students',
              url: '/users',
              icon: UserIcon,
              isDropdown: true,
            },
          ]
        : []),
    ],
  };

  return (
    <>
      <Sidebar
        collapsible='icon'
        {...props}
      >
        <nav className=' border-b  top-0 z-50 h-12 w-screen justify-between lg:inline-flex bg-blue-500 Z-50  fixed '>
          <button
            onClick={toggleSidebar}
            className=' bg-white  p-1.5 m-1.5 cursor-pointer   shadow-sm rounded-sm w-fit'
          >
            {open ? <XIcon className='h-4' /> : <PanelLeft className='h-4' />}
          </button>

          <p className={`absolute font-semibold top-3 ${open ? 'left-64 ml-10' : 'left-16 ml-2'}`}> </p>
        </nav>
        <SidebarHeader>{/* <TeamSwitcher teams={data.teams} /> */}</SidebarHeader>
        <SidebarContent className=''>
          <NavMain items={data.navMain} />
        </SidebarContent>
        <SidebarFooter>
          <Button
            className='items-center h-fit inline-flex  text-sm gap-x-2 mb-5'
            onClick={onLogout}
          >
            <LogOutIcon className='ml-2 h-5' />
            {open && 'Logout'}{' '}
          </Button>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </>
  );
}
