import { getAllAssessment, getSubmisions } from '@/api/assessment-api';
import { getAllUser } from '@/api/get.info.api';
import Breadcrumb from '@/components/bread-crumb';
import Container from '@/components/container';
import ReusableTable from '@/components/reusable-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Title from '@/components/ui/title';
import { useFetchAndDispatch } from '@/helpers/useFetch';
import { useAuth } from '@/stores/AuthContext';
import { useCourse } from '@/stores/CourseContext';
import { SearchIcon } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const Progress = () => {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Progress', isCurrentPage: true },
  ];

  const params = useParams();
  const item = useLocation();
  useFetchAndDispatch(getAllUser, 'GET_ALL_USER');
  const { allUser } = useAuth();
  const { submissions, activity } = useCourse();

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [noMatch, setNoMatch] = useState(false);
  const nav = useNavigate();
  const searchParams = new URLSearchParams(item.search);
  const myParamValue = searchParams.get('');
  useEffect(() => {
    if (item.search) {
      if (myParamValue) {
        setSelectedUser(myParamValue);

        const userData = allUser.find((x) => x._id === myParamValue);
        if (!userData) return;
        setSearchQuery(`${userData.personalData.firstName} ${userData.personalData.lastName}`);
      }
    }
  }, [item.search]);

  useEffect(() => {
    if (searchQuery === '') {
      nav('/progress');
      setSelectedUser(null)
    }
  }, [searchQuery]);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (!query) {
      setFilteredUsers([]);
      setNoMatch(false);
      return;
    }

    const results = allUser.filter(
      (x) =>
        x.userId.toLowerCase().includes(query) || // Search by user ID
        x.personalData?.firstName.toLowerCase().includes(query) ||
        x.personalData?.lastName.toLowerCase().includes(query)
    );

    setFilteredUsers(results);
    setNoMatch(results.length === 0);
  };
 
  const handleSelectUser = (user) => {
    setSearchQuery(`${user.personalData.firstName} ${user.personalData.lastName}`);
    setFilteredUsers([]);
    setSelectedUser(user._id);
    setNoMatch(false);
    nav(`/progress?=${user._id}`);
  };

  

  useFetchAndDispatch(getAllAssessment, 'SET_ACTIVITY');
  useFetchAndDispatch(getSubmisions, 'SET_SUBMISSION');

  const columns = useMemo(
    () => [
      { header: 'Name', accessor: 'title' },
      { header: 'Attempts', accessor: 'studentAttempts' },
      {
        header: 'Submission',
        accessor: 'submissions',
        render: (value) => {
          if (!value) {
            return;
          }
          return (
            <span className='flex flex-col'>
              {value != '-' ? (
                <span
                  className='text-green-500 cursor-pointer hover:underline'
                  //   /view?=67bafb89b2e7241679ddc8b4&examId=67bafe0fb2e7241679ddcaab

                  onClick={() => nav(`/${myParamValue}/submissions/view?=${value._id}&examId=${value.activityId}`)}
                >
                  View Submission
                </span>
              ) : (
                <span className='text-red-500'>-</span>
              )}
            </span>
          );
        },
      },
      { header: 'Score', accessor: 'score' },

      {
        header: 'Submission Date',
        accessor: 'submissionDate',
        render: (date) => (date ? new Date(date).toLocaleString() : '-'),
      },
      {
        header: 'Submission checked',
        accessor: 'checked',
        render: (date) => (date ? new Date(date).toLocaleString() : '-'),
      },
      {
        header: 'Status',
        accessor: 'isGraded',
      },
    ],
    []
  );

  return (
    <Container>
      <Breadcrumb items={breadcrumbItems} />
      <Title text='List of Progress' />

      <header className='w-full px-0.5 mt-3'>
        <div className='lg:w-full relative'>
          <Label> Search User</Label>
          <Input
            icon={<SearchIcon className='h-4' />}
            placeholder='Search by Name or ID'
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {filteredUsers.length > 0 && (
            <div className='absolute w-full bg-white border rounded-md shadow-md z-10 mt-1 max-h-60 overflow-auto'>
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className='p-2 cursor-pointer hover:bg-gray-100'
                  onClick={() => handleSelectUser(user)}
                >
                  {user.personalData.firstName} {user.personalData.lastName}
                </div>
              ))}
            </div>
          )}
          {noMatch && (
            <div className='absolute w-full bg-white border rounded-md shadow-md z-10 mt-1 p-2 text-gray-500'>
              No user found
            </div>
          )}
        </div>
      </header>

      <ReusableTable
        tableHeader={null}
        // onEdit={(item) =>
        //   navigate(`/progress?=${item?._id}`, {
        //     state: { isEdit: true },
        //   })
        // }
        data={selectedUser ===null ? []: activity.map((item) => {
          //overall progress
          const studentProgress = submissions.filter((x) => x.activityId === item._id && x.user === selectedUser);

          const getLatestSub = studentProgress.length > 0 ? studentProgress[studentProgress.length - 1] : undefined;

          const totalScore = item.questions.reduce((score, question) => score + question.questionPoints, 0);

          return {
            ...item,
            studentAttempts: studentProgress.length > 0 ? `${studentProgress.length} / ${item.attempts} ` : '-',
            submissions: getLatestSub ? getLatestSub : '-',
            isGraded: getLatestSub && getLatestSub.isGraded ? '✔️' : '❌',
            score: getLatestSub ? `${getLatestSub.score} / ${totalScore} ` : '-',
            submissionDate: getLatestSub && getLatestSub.submissionDate,
            checked:getLatestSub && (getLatestSub as any)?.checked
          };
        })}
        columns={columns as any}
        title='Invoice'
      />
    </Container>
  );
};

export default Progress;
