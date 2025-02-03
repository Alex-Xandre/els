/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useReducer, ReactNode, useContext } from 'react';
import CourseReducer from './CourseReducer';
import { CourseTypes, ModuleTypes, SectionTypes } from '@/helpers/types';

interface CourseState {
  courses: CourseTypes[];
  modules: ModuleTypes[];
  sections: SectionTypes[];
}

interface CourseContextType {
  courses: CourseTypes[];
  modules: ModuleTypes[];
  sections: SectionTypes[];
  dispatch: React.Dispatch<any>;
}

const INITIAL_STATE: CourseState = {
  courses: [],
  modules: [],
  sections: [],
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
