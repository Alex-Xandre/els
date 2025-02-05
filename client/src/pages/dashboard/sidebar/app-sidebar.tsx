import * as React from 'react';
import {
  AppWindowIcon,
  AudioWaveform,
  BookOpen,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PanelLeft,
  PieChart,
  Settings2,
  UserIcon,
  XIcon,
} from 'lucide-react';

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
  const { dispatch } = useAuth();
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
    teams: [
      {
        name: 'Acme Inc',
        logo: GalleryVerticalEnd,
        plan: 'Enterprise',
      },
      {
        name: 'Acme Corp.',
        logo: AudioWaveform,
        plan: 'Startup',
      },
      {
        name: 'Evil Corp.',
        logo: Command,
        plan: 'Free',
      },
    ],
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
      {
        title: 'Users',
        url: '/users',
        icon: UserIcon,
        isDropdown: true,
      },
      {
        title: 'Settings',
        url: '/settings',
        icon: Settings2,
        items: [
          {
            title: 'General',
            url: '#',
          },
          {
            title: 'Team',
            url: '#',
          },
          {
            title: 'Billing',
            url: '#',
          },
          {
            title: 'Limits',
            url: '#',
          },
        ],
      },
    ],
    projects: [
      {
        name: 'Design Engineering',
        url: '#',
        icon: Frame,
      },
      {
        name: 'Sales & Marketing',
        url: '#',
        icon: PieChart,
      },
      {
        name: 'Travel',
        url: '#',
        icon: Map,
      },
    ],
  };

  return (
    <Sidebar
      collapsible='icon'
      {...props}
    >
      <button
        onClick={toggleSidebar}
        className='absolute -right-10 top-3 bg-white  p-1.5 cursor-pointer   shadow-sm rounded-sm w-fit'
      >
        {open ? <XIcon /> : <PanelLeft className='' />}
      </button>

      <SidebarHeader>{/* <TeamSwitcher teams={data.teams} /> */}</SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <Button onClick={onLogout}>Logout</Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
