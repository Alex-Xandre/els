import { useAuth } from '@/stores/AuthContext';
import { useCourse } from '@/stores/CourseContext';

import { useEffect } from 'react';

type GetDataFn = (id?: string) => Promise<any>;

export const useFetchAndDispatch = (getDataFn: GetDataFn, actionType: string, id?: string) => {
  const { dispatch: authDispatch } = useAuth();
  const { dispatch: coursesDispatch } = useCourse();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDataFn(id);

        // Dispatch to both contexts
        authDispatch({ type: actionType, payload: data });
        coursesDispatch({ type: actionType, payload: data });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [getDataFn, actionType, authDispatch, coursesDispatch]);
};
