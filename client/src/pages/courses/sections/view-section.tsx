import Container from '@/components/container';
import NavContainer from '@/components/nav-container';
import { AssesmentType, ModuleTypes, SectionTypes } from '@/helpers/types';
import { useCourse } from '@/stores/CourseContext';

import React, { useEffect, useState } from 'react';
import Title from '@/components/ui/title';
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getAllModules, getAllSections, getSectionOrganization } from '@/api/course.api';
import { useFetchAndDispatch } from '@/helpers/useFetch';
import Breadcrumb from '@/components/bread-crumb';
import SectionCard from './section-card';
import { getAllAssessment } from '@/api/assessment-api';
import ActivityCard from './activity-card';

const coverImages = [
  'https://res.cloudinary.com/dgb3br9x6/image/upload/v1737850853/cover1_h28tl3.webp',
  'https://res.cloudinary.com/dgb3br9x6/image/upload/v1737850853/cover2_tqh446.webp',
  'https://res.cloudinary.com/dgb3br9x6/image/upload/v1737850853/cover3_soq0xt.webp',
  'https://res.cloudinary.com/dgb3br9x6/image/upload/v1737850853/cover4_d5j1re.webp',
];

// Utility function to get a random cover image
export const getRandomCover = (): string => {
  const randomIndex = Math.floor(Math.random() * coverImages.length);
  return coverImages[randomIndex];
};

const ViewModule = () => {
  const { sections, modules, activity } = useCourse();

  const [organizeSection, setOrganizeSection] = useState([]);

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

  useFetchAndDispatch(getAllAssessment, 'SET_ACTIVITY');

  useEffect(() => {
    const fetchData = async () => {
      const res = await getSectionOrganization(myParamValue);
      if (res) {
        setOrganizeSection(res.contentId);
      }
    };

    fetchData();
  }, []);

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

  console.log(activity);

  return (
    <Container>
      <NavContainer>
        <Title text={module?.title} />
        <div className='inline-flex gap-x-2'>
          <Button onClick={() => navigate(`/${myParamValue}/new-assesment`)}>Add Assessment</Button>
          <Button
            variant='secondary'
            onClick={() => navigate(`/${myParamValue}/new-lectures`)}
          >
            Add Lectures
          </Button>
        </div>
      </NavContainer>

      <Breadcrumb items={breadcrumbItems} />

      {organizeSection.map((item) => {
        const findSection: SectionTypes = sections.find((x) => x._id === item);
        const findAssesment: AssesmentType = activity.find((x) => x._id === item);

        if (findAssesment) {
          return (
            <ActivityCard
              key={findAssesment._id}
              cardData={findAssesment}
            />
          );
        } else if (findSection) {
          return (
            <SectionCard
              key={findSection._id}
              cardData={{ ...findSection, cover: findSection.cover === '' ? getRandomCover() : findSection.cover }}
            />
          );
        }
      })}

      {/* {sections.filter((x) => x.moduleId?._id === myParamValue).length === 0 ? (
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
      )} */}
    </Container>
  );
};

export default ViewModule;
