import React, { useEffect, useState } from 'react';
import { CourseTypes } from '@/helpers/types'; // Import the CourseTypes interface
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import Container from '@/components/container';
import { Button } from '@/components/ui/button';
import { createOrUpdateCourse, getAllCourses } from '@/api/course.api';
import Breadcrumb from '@/components/bread-crumb';
import Title from '@/components/ui/title';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCourse } from '@/stores/CourseContext';
import { useFetchAndDispatch } from '@/helpers/useFetch';
import toast from 'react-hot-toast';

const CoursePage: React.FC = () => {
  // State to manage form data
  const [course, setCourse] = useState<CourseTypes>({
    _id: '', 
    title: '',
    description: '',
    instructor: '',
    category: '',
    cover: '',
  });

  const { courses } = useCourse();
  const navigate = useNavigate();
  useFetchAndDispatch(getAllCourses, 'SET_COURSES');

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCourse((prevCourse) => ({
      ...prevCourse,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createOrUpdateCourse(course);
    if (res) {
      toast.success('Success');
      navigate(-1);
    }
  };

  // Define form fields based on CourseTypes
  const formFields = [
    { name: 'title', label: 'Title', type: 'text' },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'category', label: 'Category', type: 'text' },
    { name: 'cover', label: 'Banner', type: 'file' },
  ];

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Modules', href: '/courses' },
    { label: course?._id === '' ? 'New' : 'Edit', isCurrentPage: true },
  ];

  const item = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(item.search);

    const myParamValue = searchParams.get('');
    if (myParamValue) {
      const items = courses.find((x) => x?._id === myParamValue);
      if (!items) return;

      setCourse(courses.find((x) => x?._id === myParamValue));
    }
  }, [courses, item.search]);

  return (
    <Container>
      <Title text='Modules' />
      <Breadcrumb items={breadcrumbItems} />
      <form
        onSubmit={handleSubmit}
        className='space-y-4 w-full'
      >
        {formFields.map((field) => (
          <div key={field.name}>
            <label className='block text-sm font-medium text-gray-700'>{field.label}</label>
            {field.type === 'textarea' ? (
              <Textarea
                placeholder='Type your message here.'
                name={field.name}
                value={course[field.name as keyof CourseTypes] as string}
                onChange={handleInputChange}
                rows={4}
                required
              />
            ) : (
              <Input
                type={field.type}
                name={field.name}
                value={field.type === 'file' ? undefined : (course[field.name as keyof CourseTypes] as string)}
                onChange={handleInputChange}
              />
            )}
          </div>
        ))}

        {course.cover && (
          <div>
            <label className='block text-sm font-medium text-gray-700'>Current Banner</label>
            <a
              href={course.cover}
              target='_blank'
              rel='noopener noreferrer'
            >
              <img
                src={course.cover}
                alt='Course Cover'
                className='mt-2 w-32 h-32 object-cover rounded'
              />
            </a>
          </div>
        )}

        <Button type='submit'>Add Module</Button>
      </form>
    </Container>
  );
};

export default CoursePage;
