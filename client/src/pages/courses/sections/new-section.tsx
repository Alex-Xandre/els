import { createOrUpdateSection, getAllModules, getAllSections } from '@/api/course.api';
import Breadcrumb from '@/components/bread-crumb';
import Container from '@/components/container';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Title from '@/components/ui/title';
import { handleFileChange } from '@/helpers/file-upload';
import { SectionTypes } from '@/helpers/types';
import { useFetchAndDispatch } from '@/helpers/useFetch';
import { useCourse } from '@/stores/CourseContext';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';

const NewSection = () => {
  const { sectionId } = useParams();
  const { sections, modules } = useCourse();
  const navigate = useNavigate();
  useFetchAndDispatch(getAllModules, 'SET_MODULES');
  useFetchAndDispatch(getAllSections, 'SET_SECTIONS');
  const [section, setSection] = useState<SectionTypes>({
    _id: '',
    title: '',
    videoUrl: '',
    resource: '',
    moduleId: sectionId,
    sectionType: '',
    cover: '',
  });

  const formFields = [
    { name: 'sectionType', label: 'Type', type: 'option' },
    { name: 'title', label: 'Title', type: 'text' },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'resource', label: 'Resource', type: 'file' },
    { name: 'cover', label: 'Banner', type: 'file' },
  ];

  const courseId = modules.find((item) => item._id === sectionId);

  const item = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(item.search);
    const myParamValue = searchParams.get('');

    if (myParamValue) {
      const items = sections.find((item) => item._id === myParamValue);

      if (!items) return;
      setSection(items);
    }
  }, [ item.search]);

  console.log(section);

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: `${courseId?.title}`, href: `/${courseId?.courseId._id}/view?=${sectionId}` },
    { label: section?._id === '' ? 'New' : 'Edit', isCurrentPage: true },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setSection((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedUrl = await handleFileChange(e);

    if (uploadedUrl) {
      setSection((prev) => ({
        ...prev,
        [e.target.name]: uploadedUrl,
      }));
    }
  };

  //submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await createOrUpdateSection(section);
    if (res) {
      toast.success('Success');
      navigate(-1);
    }
  };

  return (
    <Container>
      <Title text='Lectures' />
      <Breadcrumb items={breadcrumbItems} />
      <form
        className='w-full space-y-4 flex flex-wrap gap-2 mt-2'
        onSubmit={handleSubmit}
      >
        {formFields.map((field) => (
          <div
            key={field.name}
            className={` w-full ${field.name === 'title' && 'lg:!-mt-[.5px] '}
              ${field.name === 'title' || field.name === 'sectionType' ? 'lg:w-[49.5%]' : 'lg:w-full'}`}
          >
            <Label>{field.label}</Label>

            {field.type === 'option' ? (
              <Select
                onValueChange={(value) => {
                  setSection((prev) => ({
                    ...prev,
                    ['sectionType']: value,
                  }));
                }}
                value={section[field.name as keyof SectionTypes] as string}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select file type' />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem
                    value='word'
                    className='hover:bg-white'
                  >
                    Word Documents
                  </SelectItem>
                  <SelectItem value='pdf'>PDF Document</SelectItem>
                  <SelectItem value='excel'>Excel</SelectItem>
                  <SelectItem value='video'>Video</SelectItem>
                </SelectContent>
              </Select>
            ) : field.type === 'textarea' ? (
              <Textarea
                placeholder=''
                name={field.name}
                value={section[field.name as keyof SectionTypes] as string}
                onChange={handleChange}
                required
                rows={3}
              />
            ) : (
              <Input
                type={field.type}
                placeholder=''
                name={field.name}
                value={field.type === 'file' ? undefined : (section[field.name as keyof SectionTypes] as string)}
                onChange={field.type === 'file' ? onFileUpload : handleChange}
              />
            )}
          </div>
        ))}

        <div className='w-full'>
          {section.cover && (
            <div>
              <label className='block text-sm font-medium text-gray-700'>Current Banner</label>
              <a
                href={section.cover}
                target='_blank'
                rel='noopener noreferrer'
              >
                <img
                  src={section.cover}
                  alt='Course Cover'
                  className='mt-2 w-32 h-32 object-cover rounded'
                />
              </a>
            </div>
          )}
        </div>
        <div>
          <Button type='submit'>Add Lectures</Button>
          <Button
            className='ml-2'
            variant='destructive'
            type='button'
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Container>
  );
};

export default NewSection;
