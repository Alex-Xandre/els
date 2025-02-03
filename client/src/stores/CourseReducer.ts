/* eslint-disable @typescript-eslint/no-explicit-any */
import { CourseTypes, ModuleTypes, SectionTypes } from '@/helpers/types';

const CourseReducer = (state: any, action: { type: any; payload?: any }): any => {
  switch (action.type) {
    case 'ADD_COURSE':
      return {
        ...state,
        courses: [...state.courses, action.payload],
      };
    case 'UPDATE_COURSE': {
      const updatedCourse = action.payload;
      const updatedCourses = state.courses.map((course: CourseTypes) =>
        course._id === updatedCourse._id ? updatedCourse : course
      );
      return {
        ...state,
        courses: updatedCourses,
      };
    }
    case 'DELETE_COURSE': {
      const courseId = action.payload;
      const filteredCourses = state.courses.filter((course: CourseTypes) => course._id !== courseId);
      return {
        ...state,
        courses: filteredCourses,
      };
    }
    case 'ADD_MODULE':
      return {
        ...state,
        modules: [...state.modules, action.payload],
      };
    case 'UPDATE_MODULE': {
      const updatedModule = action.payload;
      const updatedModules = state.modules.map((module: ModuleTypes) =>
        module._id === updatedModule._id ? updatedModule : module
      );
      return {
        ...state,
        modules: updatedModules,
      };
    }
    case 'DELETE_MODULE': {
      const moduleId = action.payload;
      const filteredModules = state.modules.filter((module: ModuleTypes) => module._id !== moduleId);
      return {
        ...state,
        modules: filteredModules,
      };
    }
    case 'ADD_SECTION':
      return {
        ...state,
        sections: [...state.sections, action.payload],
      };
    case 'UPDATE_SECTION': {
      const updatedSection = action.payload;
      const updatedSections = state.sections.map((section: SectionTypes) =>
        section._id === updatedSection._id ? updatedSection : section
      );
      return {
        ...state,
        sections: updatedSections,
      };
    }
    case 'DELETE_SECTION': {
      const sectionId = action.payload;
      const filteredSections = state.sections.filter((section: SectionTypes) => section._id !== sectionId);
      return {
        ...state,
        sections: filteredSections,
      };
    }
    case 'SET_COURSES':
      return {
        ...state,
        courses: action.payload,
      };
    case 'SET_MODULES':
      return {
        ...state,
        modules: action.payload,
      };
    case 'SET_SECTIONS':
      return {
        ...state,
        sections: action.payload,
      };
    default:
      return state;
  }
};

export default CourseReducer;
