/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAllModules, getAllSections } from '@/api/course.api';
import Container from '@/components/container';
import NavContainer from '@/components/nav-container';
import { Button } from '@/components/ui/button';
import Title from '@/components/ui/title';
import { CourseTypes } from '@/helpers/types';
import { useFetchAndDispatch } from '@/helpers/useFetch';
import { useCourse } from '@/stores/CourseContext';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ModuleCard from './module-card';
import Breadcrumb from '@/components/bread-crumb';
import { useAuth } from '@/stores/AuthContext';
import { getAllAssessment } from '@/api/assessment-api';

const ViewCourse = () => {
  const [course, setCourse] = useState<CourseTypes>({
    _id: '',
    title: '',
    description: '',
    instructor: '',
    category: '',
    cover: '',
  });

  const item = useLocation();
  const { courses, modules } = useCourse();
  const { user } = useAuth();

  useFetchAndDispatch(getAllModules, 'SET_MODULES');
  useFetchAndDispatch(getAllAssessment, 'SET_ACTIVITY');
  useFetchAndDispatch(getAllSections, 'SET_SECTIONS');

  const searchParams = new URLSearchParams(item.search);
  const myParamValue = searchParams.get('');

  useEffect(() => {
    if (myParamValue) {
      const items = courses.find((x) => (x as any)?._id === myParamValue);
      if (!items) return;

      setCourse(courses.find((x) => (x as any)?._id === myParamValue));
    }
  }, [courses, item.search]);

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: course.title, href: '/courses', isCurrentPage: true },
  ];
  const navigate = useNavigate();

  return (
    <Container>
      <NavContainer>
        <Title text={course?.title} />
        {user.role === 'admin' && <Button onClick={() => navigate(`/${myParamValue}/new`)}>Add Section</Button>}
      </NavContainer>

      <Breadcrumb items={breadcrumbItems} />
      {modules.filter((x) => (x.courseId as any)?._id === course._id).length === 0 ? (
        <div className='text-center text-gray-500 py-6'>No sections found for this course.</div>
      ) : (
        modules
          .filter((x) => (x.courseId as any)?._id === course._id)
          .map((x) => (
            <ModuleCard
              key={x._id}
              module={x}
            />
          ))
      )}
    </Container>
  );
};

export default ViewCourse;
