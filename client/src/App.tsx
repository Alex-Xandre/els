import React, { Suspense, useCallback, useContext, useEffect } from 'react';
import LoginLayout from './pages/auth/LoginLayout';
import Home from './pages/dashboard/Home';
import { Route, Routes } from 'react-router-dom';
import { useAuth } from './stores/AuthContext';
import NotFound from './helpers/not-found';
import { SocketContext } from './stores/SocketContext';
import toast, { Toaster } from 'react-hot-toast';
import { getUser } from './api/get.info.api';
import { AppSidebar } from './pages/dashboard/sidebar/app-sidebar';
import CourseHome from './pages/courses';
import CoursePage from './pages/courses/new';
import ViewCourse from './pages/courses/modules/view-module';
import ModulePage from './pages/courses/modules/new-module';
import ViewModule from './pages/courses/sections/view-section';
import ViewSection from './pages/courses/sections/new-section';
import NewAssesment from './pages/courses/assesment/new-assesment';
import UserHome from './pages/user';
import NewUser from './pages/user/new';
import HomeStudent from './pages/dashboard/HomeStudent';

const App = () => {
  const { isLoggedIn, user, dispatch } = useAuth();
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      const handlegetInfo = async () => {
        const res = await getUser();
        if (res.success === false) return toast.error(res.data?.msg || 'Error');
        dispatch({ type: 'SIGNING', payload: res });
        socket.emit('login', res._id);
      };
      handlegetInfo();
    }
  }, [dispatch, isLoggedIn]);

  const adminRoutes = [
    { path: '/', element: <Home /> },
    { path: '/courses', element: <CourseHome /> },
    { path: '/courses/new', element: <CoursePage /> },

    { path: '/:moduleId/new', element: <ModulePage /> },
    { path: '/moduleId', element: <ViewCourse /> },

    { path: '/:moduleId/view', element: <ViewModule /> },
    { path: '/:sectionId/new-lectures', element: <ViewSection /> },

    { path: '/:sectionId/new-assesment', element: <NewAssesment /> },

    { path: '/users', element: <UserHome /> },
    { path: '/users/new', element: <NewUser /> },
  ];

  const studentRoutes = [
    { path: '/', element: <HomeStudent /> },
    { path: '/courses', element: <CourseHome /> },
    { path: '/moduleId', element: <ViewCourse /> },
    { path: '/:moduleId/view', element: <ViewModule /> },
    { path: '/users', element: <UserHome /> },
  ];

  const publicRoutes = [{ path: '/', element: <LoginLayout /> }];

  const renderRoutes = useCallback(() => {
    return (
      <Routes>
        {isLoggedIn &&
          user.role === 'admin' &&
          adminRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
            />
          ))}

        {isLoggedIn &&
          user.role === 'user' &&
          studentRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
            />
          ))}

        {!isLoggedIn &&
          publicRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
            />
          ))}

        <Route
          path='*'
          element={<NotFound />}
        />
      </Routes>
    );
  }, [isLoggedIn, user]);

  return (
    <div className='  overflow-y-hidden overflow-x-hidden h-[100dvh] w-screen'>
      <Toaster />
      <Suspense fallback={<div>Loading...</div>}>
        {renderRoutes()}
        {isLoggedIn && <AppSidebar />}
      </Suspense>
    </div>
  );
};

export default App;
