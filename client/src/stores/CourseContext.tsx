/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useReducer, ReactNode, useContext } from 'react';
import CourseReducer from './CourseReducer';
import { AssesmentType, CourseTypes, ModuleTypes, ProgressType, SectionTypes, SubmissionType } from '@/helpers/types';

interface CourseState {
  courses: CourseTypes[];
  modules: ModuleTypes[];
  sections: SectionTypes[];
  activity: AssesmentType[];
  progress: ProgressType[];
  submissions: SubmissionType[];
}

interface CourseContextType {
  courses: CourseTypes[];
  modules: ModuleTypes[];
  sections: SectionTypes[];
  activity: AssesmentType[];
  progress: ProgressType[];
  submissions: SubmissionType[];
  dispatch: React.Dispatch<any>;
}

const INITIAL_STATE: CourseState = {
  courses: [],
  modules: [],
  sections: [],
  activity: [],
  progress: [],
  submissions: [],
};

export const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(CourseReducer, INITIAL_STATE);

  return (
    <CourseContext.Provider
      value={{
        progress: state.progress,
        courses: state.courses,
        modules: state.modules,
        sections: state.sections,
        activity: state.activity,
        submissions: state.submissions,
        dispatch,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export const useCourse = () => {
  const context = useContext(CourseContext);

  if (!context) {
    throw new Error('useCourse must be used within a CourseContextProvider');
  }

  return context;
};
