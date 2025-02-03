import ReusableTable from '@/components/reusable-table';
import Container from '@/components/container';
import Title from '@/components/ui/title';
import NavContainer from '@/components/nav-container';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useCourse } from '@/stores/CourseContext';
import { useFetchAndDispatch } from '@/helpers/useFetch';
import { getAllCourses } from '@/api/course.api';
import Breadcrumb from '@/components/bread-crumb';

const CourseHome = () => {
  const { courses } = useCourse();
  useFetchAndDispatch(getAllCourses, 'SET_COURSES');

  const columns = [
    { header: 'ID', accessor: '_id' },
    { header: 'Title', accessor: 'title' },
    { header: 'Description', accessor: 'description' },
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
            <Button onClick={() => navigate('new')}>Create Module</Button>
          </NavContainer>
        }
        data={courses}
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
