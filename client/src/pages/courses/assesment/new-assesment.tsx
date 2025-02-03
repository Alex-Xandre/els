import { getAllModules } from '@/api/course.api';
import Breadcrumb from '@/components/bread-crumb';
import Container from '@/components/container';
import { Input } from '@/components/ui/input';
import Title from '@/components/ui/title';
import { AssesmentType, QuestionTypes } from '@/helpers/types';
import { useFetchAndDispatch } from '@/helpers/useFetch';
import { useCourse } from '@/stores/CourseContext';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import MultipleChoice from './multiple-choice';
import { Button } from '@/components/ui/button';
import Indentification from './identification';
import { Textarea } from '@/components/ui/textarea';
import EnumerationQuestion from './enumeration';
import EssayQuestion from './essay';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import PreviewAssessment from './view-assesment-summary';
import { questionsDummy } from './test-data';

const NewAssesment = () => {
  const { modules } = useCourse();
  useFetchAndDispatch(getAllModules, 'SET_MODULES');
  const [assesment, setAssesment] = useState<AssesmentType>({
    title: '',
    description: '',
    questions: questionsDummy,
    moduleId: '',
    assesmentDueDate: new Date(),
    timeLimit: 60,
    status: 'draft',
    category: '',
  });
  const [questionIndex, setQuestionIndex] = useState(0);

  const [isPreview, setIsPreview] = useState(false);

  const { sectionId } = useParams();

  const courseId = modules.find((item) => item._id === sectionId);
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

  return (
    <Container>
      <Title text='Lectures' />
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
            <Input
              type='text'
              name='title'
              value={assesment.title}
              onChange={handleAssesmentChange}
              placeholder='Assesment Title'
            />

            <Textarea
              name='description'
              rows={5}
              value={assesment.description}
              onChange={handleAssesmentChange}
              placeholder='Assesment Description'
            />

            <Button onClick={() => setIsPreview(true)}>Publish Assesment</Button>

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
                <Label className='!mt-5'> Question Type</Label>

                <Select
                  onValueChange={(value) => {
                    handleQuestionChange(index, 'questionType', value);
                  }}
                  value={items.questionType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select question type' />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem
                      value='multiple-choice'
                      className='hover:bg-white'
                    >
                      Multiple Choice
                    </SelectItem>
                    <SelectItem value='enumeration'>Enumeration</SelectItem>
                    <SelectItem value='identification'>Identification</SelectItem>
                    <SelectItem value='essay'>Essay</SelectItem>
                  </SelectContent>
                </Select>
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
