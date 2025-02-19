import { getAllModules } from '@/api/course.api';
import Breadcrumb from '@/components/bread-crumb';
import Container from '@/components/container';
import { Input } from '@/components/ui/input';
import Title from '@/components/ui/title';
import { AssesmentType, QuestionTypes } from '@/helpers/types';
import { useFetchAndDispatch } from '@/helpers/useFetch';
import { useCourse } from '@/stores/CourseContext';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import MultipleChoice from './multiple-choice';
import { Button } from '@/components/ui/button';
import Indentification from './identification';
import { Textarea } from '@/components/ui/textarea';
import EnumerationQuestion from './enumeration';
import EssayQuestion from './essay';

import { Label } from '@/components/ui/label';
import PreviewAssessment from './view-assesment-summary';
import { questionsDummy } from './test-data';
import { createOrUpdateAssesment, getAllAssessment } from '@/api/assessment-api';
import toast from 'react-hot-toast';
import SelectInput from '@/components/reusable-select';

const NewAssesment = () => {
  const { modules, activity } = useCourse();

  const [questionIndex, setQuestionIndex] = useState(0);

  const [isPreview, setIsPreview] = useState(false);

  const { sectionId } = useParams();

  useFetchAndDispatch(getAllModules, 'SET_MODULES');
  const [assesment, setAssesment] = useState<AssesmentType>({
    _id: '',
    title: '',
    description: '',
    questions: questionsDummy,
    moduleId: sectionId,
    startDate: new Date(),
    assesmentDueDate: new Date(),
    timeLimit: 60,
    status: 'draft',
    category: 'quiz',
  });

  const courseId = modules.find((item) => item._id === sectionId);

  useFetchAndDispatch(getAllAssessment, 'SET_ACTIVITY');
  const item = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(item.search);
    const myParamValue = searchParams.get('');

    if (myParamValue) {
      const items = activity.find((item) => item._id === myParamValue);

      if (!items) return;

      setAssesment({ ...items,
        startDate: new Date( items.startDate? items.startDate : new Date())?.toISOString().slice(0, 16) as any ,
        assesmentDueDate: new Date(items.assesmentDueDate)?.toISOString().slice(0, 16) as any });
    }
  }, [item.search]);

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: `${courseId?.title}`, href: `/${courseId?.courseId?._id}/view?=${sectionId}` },
  ];

  //title and desc handlechange
  const handleAssesmentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAssesment({ ...assesment, [name]: value });
  };

  //adding question
  const handleNewQuestion = () => {
    const newQuestion: QuestionTypes = {
      questionText: '',
      questionType: 'multiple-choice',
      options: [''],
      correctAnswer: '',
      explanation: '',
      questionPoints: 0,
      difficulty: 'easy',
    };
    setAssesment({ ...assesment, questions: [...assesment.questions, newQuestion] });

    setQuestionIndex(assesment.questions.length);
  };

  const handleQuestionChange = (index: number, field: string, value: string | string[]) => {
    const updatedQuestion = [...assesment.questions];
    updatedQuestion[index] = { ...updatedQuestion[index], [field]: value };
    setAssesment({ ...assesment, questions: updatedQuestion });
  };

  const renderQuestions = (question: QuestionTypes, index: number) => {
    switch (question.questionType) {
      case 'multiple-choice':
        return (
          <MultipleChoice
            question={question}
            index={index}
            onChange={handleQuestionChange}
          />
        );

      case 'identification':
        return (
          <Indentification
            question={question}
            index={index}
            onChange={handleQuestionChange}
          />
        );
      case 'enumeration':
        return (
          <EnumerationQuestion
            question={question}
            index={index}
            onChange={handleQuestionChange}
          />
        );

      case 'essay':
        return <EssayQuestion />;
      default:
        return null;
    }
  };

  const handleNextQuestion = () => {
    if (questionIndex < assesment.questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (questionIndex > 0) {
      setQuestionIndex(questionIndex - 1);
    }
  };

  const handleRemoveQuestion = () => {
    if (window.confirm(`Remove Question ?`)) {
      const updatedQuestions = [...assesment.questions];
      updatedQuestions.splice(questionIndex, 1);

      setAssesment({ ...assesment, questions: updatedQuestions });

      if (questionIndex > 0) {
        setQuestionIndex(questionIndex - 1);
      } else {
        setQuestionIndex(0);
      }
    }
  };

  const navigate = useNavigate();
  const handleSubmit = async () => {
    const res = await createOrUpdateAssesment(assesment);
    if (res) {
      toast.success('Success');
      navigate(-1);
    }
  };
  return (
    <Container>
      <header className='inline-flex w-full justify-between pr-3'>
        <Title text='Lectures' />
        {isPreview && <Button onClick={handleSubmit}>Save Changes</Button>}
      </header>
      <Breadcrumb items={breadcrumbItems} />

      {isPreview ? (
        <PreviewAssessment
          assesment={assesment}
          handleAssesmentChange={handleAssesmentChange}
          hadnleQuestionIndex={(index) => {
            setIsPreview(false);
            setQuestionIndex(index);
          }}
        />
      ) : (
        <section className='w-full flex flex-col gap-y-3 overflow-y-auto h-[calc(100vh-200px)]'>
          <div className='inline-flex items-center w-full justify-between mt-4 sticky top-0 z-20 bg-white border-b pb-4'>
            <div className='space-x-3'>
              <Button onClick={handleNewQuestion}>Add Question</Button>
              <Button
                onClick={handleRemoveQuestion}
                variant='destructive'
              >
                Remove Question
              </Button>
            </div>
          </div>
          <div className='px-1 space-y-3'>
            <div className='flex gap-x-3'>
              <div className='w-full space-y-3'>
                <div className='w-full'>
                  <Label>Title</Label>
                  <Input
                    type='text'
                    name='title'
                    value={assesment.title}
                    onChange={handleAssesmentChange}
                    placeholder='Assesment Title'
                  />
                </div>

                <div className='w-full'>
                  <Label>Type Date</Label>

                  <SelectInput
                    value={assesment.category}
                    onValueChange={(value) => {
                      setAssesment({ ...assesment, ['category']: value as any });
                    }}
                    options={['homework', 'quiz', 'activity']}
                    placeholder={'Difficulty'}
                  />
                </div>
              </div>

              <div className='space-y-3'>
                <div>
                  <Label> Submission</Label>
                  <Input
                    type='checkbox'
                    name='isLate'
                    checked={assesment?.isLate}
                    onChange={(e) => setAssesment((prev) => ({ ...prev, isLate: e.target.checked }))}
                    placeholder='Allow Late?'
                  />
                </div>
                <div>
                  <Label>Max Attempts</Label>
                  <Input
                    type='number'
                    name='attempts'
                    value={assesment.attempts}
                    onChange={handleAssesmentChange}
                    placeholder='Assesment Title'
                  />
                </div>
              </div>

              <div className='space-y-3'>
                <div>
                  <Label>Start Date</Label>
                  <Input
                    type='datetime-local'
                    name='startDate'
                    value={assesment.startDate as any}
                    onChange={handleAssesmentChange}
                    placeholder='Assesment Title'
                  />
                </div>
                <div>
                  <Label>Due Date</Label>
                  <Input
                    type='datetime-local'
                    name='assesmentDueDate'
                    value={assesment.assesmentDueDate as any}
                    onChange={handleAssesmentChange}
                    placeholder='Assesment Title'
                  />
                </div>
              </div>
            </div>
            <Textarea
              name='description'
              rows={5}
              value={assesment.description}
              onChange={handleAssesmentChange}
              placeholder='Assesment Description'
            />

            <div className='inline-flex justify-between w-full'>
              <Button onClick={() => setIsPreview(true)}>Publish Assesment</Button>

              <div className='space-x-3'>
                <Button
                  onClick={handlePreviousQuestion}
                  disabled={questionIndex === 0}
                >
                  Previous
                </Button>

                <Button
                  onClick={handleNextQuestion}
                  disabled={questionIndex === assesment.questions.length - 1}
                >
                  Next
                </Button>
              </div>
            </div>
            {assesment.questions.map((items, index) => (
              <div className={`${index !== questionIndex && 'hidden'} mt-5`}>
                <Label className='!mt-5'>Question # {index + 1}</Label>

                <Textarea
                  className='my-4'
                  name='questionText'
                  value={items.questionText}
                  onChange={(e) => handleQuestionChange(index, 'questionText', e.target.value)}
                  placeholder='Question'
                />

                <div className='flex gap-x-3'>
                  <div className='flex-1'>
                    <Label className='!mt-5'> Question Points</Label>

                    <Input
                      name='questionPoints'
                      value={items.questionPoints}
                      onChange={(e) => handleQuestionChange(index, 'questionPoints', e.target.value)}
                      placeholder='Points'
                    />
                  </div>

                  <div className='flex-1'>
                    <Label className='!mt-5'> Question Difficulty</Label>

                    <SelectInput
                      value={items.difficulty}
                      onValueChange={(value) => {
                        handleQuestionChange(index, 'difficulty', value.toLowerCase());
                      }}
                      options={['easy', 'medium', 'hard']}
                      placeholder={'Difficulty'}
                    />
                  </div>

                  <div className='flex-1'>
                    <Label className='!mt-5'> Question Type</Label>
                    <SelectInput
                      value={items.questionType}
                      onValueChange={(value) => {
                        handleQuestionChange(index, 'questionType', value.toLowerCase());
                      }}
                      options={['enumeration', 'multiple-choice', 'identification', 'essay']}
                      placeholder={'Question Type'}
                    />
                  </div>
                </div>
              </div>
            ))}

            {assesment.questions.length > 0 && renderQuestions(assesment.questions[questionIndex], questionIndex)}
          </div>
        </section>
      )}
    </Container>
  );
};

export default NewAssesment;
