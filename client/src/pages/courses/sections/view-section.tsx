import Container from '@/components/container';
import NavContainer from '@/components/nav-container';
import { ModuleTypes } from '@/helpers/types';
import { useCourse } from '@/stores/CourseContext';

import React, { useEffect, useState } from 'react';
import Title from '@/components/ui/title';
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getAllModules, getAllSections } from '@/api/course.api';
import { useFetchAndDispatch } from '@/helpers/useFetch';
import Breadcrumb from '@/components/bread-crumb';
import SectionCard from './section-card';

const ViewModule = () => {
  const { sections, modules } = useCourse();

  const [module, setModule] = useState<ModuleTypes>({
    _id: '',
    title: '',
    description: '',
    cover: '',
    courseId: '',
  });
  const navigate = useNavigate();
  const moduleId = useParams();
  const item = useLocation();

  const searchParams = new URLSearchParams(item.search);
  const myParamValue = searchParams.get('');

  useFetchAndDispatch(getAllSections, 'SET_SECTIONS');
  useFetchAndDispatch(getAllModules, 'SET_MODULES');

  console.log(modules, moduleId);
  useEffect(() => {
    if (myParamValue) {
      const items = modules.find((x) => x?._id === myParamValue);
      if (!items) return;

      setModule(modules.find((x) => x?._id === myParamValue));
    }
  }, [modules, item.search]);

  console.log(module);
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: module.title, href: `/moduleId?=${module._id}`, isCurrentPage: true },
  ];

  return (
    <Container>
      <NavContainer>
        <Title text={module?.title} />
        <div className='inline-flex gap-x-2'>
          <Button onClick={() => navigate(`/${myParamValue}/new-assesment`)}>Add Assesment</Button>
          <Button variant='secondary' onClick={() => navigate(`/${myParamValue}/new-lectures`)}>Add Lectures</Button>
        </div>
      </NavContainer>

      <Breadcrumb items={breadcrumbItems} />

      {sections.filter((x) => x.moduleId?._id === myParamValue).length === 0 ? (
        <div className='text-center text-gray-500 py-6'>No content found for this section.</div>
      ) : (
        sections
          .filter((x) => (x.moduleId as any)?._id === myParamValue)
          .map((x) => (
            <SectionCard
              key={x._id}
              cardData={x}
            />
          ))
      )}
    </Container>
  );
};

export default ViewModule;
