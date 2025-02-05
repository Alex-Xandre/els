/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useReducer, ReactNode, useContext } from 'react';
import CourseReducer from './CourseReducer';
import { AssesmentType, CourseTypes, ModuleTypes, SectionTypes } from '@/helpers/types';

interface CourseState {
  courses: CourseTypes[];
  modules: ModuleTypes[];
  sections: SectionTypes[];
  activity: AssesmentType[];
}

interface CourseContextType {
  courses: CourseTypes[];
  modules: ModuleTypes[];
  sections: SectionTypes[];
  activity: AssesmentType[];
  dispatch: React.Dispatch<any>;
}

const INITIAL_STATE: CourseState = {
  courses: [],
  modules: [],
  sections: [],
  activity: [],
};

export const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(CourseReducer, INITIAL_STATE);

  return (
    <CourseContext.Provider
      value={{
        courses: state.courses,
        modules: state.modules,
        sections: state.sections,
        activity: state.activity,
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
