/* eslint-disable @typescript-eslint/no-explicit-any */
import ReusableTable from '@/components/reusable-table';
import Container from '@/components/container';
import Title from '@/components/ui/title';
import NavContainer from '@/components/nav-container';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useCourse } from '@/stores/CourseContext';
import { useFetchAndDispatch } from '@/helpers/useFetch';
import { getAllCourses, getAllModules } from '@/api/course.api';
import Breadcrumb from '@/components/bread-crumb';
import { useAuth } from '@/stores/AuthContext';
const CourseHome = () => {
  const { courses, modules } = useCourse();
  const { user } = useAuth();
  useFetchAndDispatch(getAllCourses, 'SET_COURSES');
  useFetchAndDispatch(getAllModules, 'SET_MODULES');

  const columns = [
    ...(user.role === 'admin' ? [{ header: 'ID', accessor: '_id' }] : []),
    { header: 'Title', accessor: 'title' },
    { header: 'Description', accessor: 'description' },
    { header: 'Contents Inside', accessor: 'content' },
  ];

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Modules', isCurrentPage: true },
  ];

  const navigate = useNavigate();
  return (
    <Container>
      <Breadcrumb items={breadcrumbItems} />
      <ReusableTable
        tableHeader={
          <NavContainer>
            <Title text='List of Module' />
            {user.role === 'admin' && <Button onClick={() => navigate('new')}>Create Module</Button>}
          </NavContainer>
        }
        data={courses.map((item) => {
          return {
            ...item,
            content: modules.filter((x) => (x.courseId as any)?._id === item._id).length,
          };
        })}
        columns={columns as any}
        caption='A list of your modules'
        onEdit={(item) => navigate(`/courses/new?=${item?._id}`, { state: { isEdit: true } })}
        onView={(item) => navigate(`/moduleId?=${item?._id}`, { state: { isEdit: true } })}
        title='Invoice'
      />
    </Container>
  );
};

export default CourseHome;
