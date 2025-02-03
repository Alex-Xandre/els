/* eslint-disable @typescript-eslint/no-explicit-any */
export type TableProps<T> = {
  data: T[];
  columns: Column<T>[];
  onEdit: (item: T) => void;
  onRemove: (item: T) => void;
  onUpdateMax?: (item: T) => void;
  title?: string;
};

export type Column<T> = {
  header: string;
  accessor: keyof T;
  render?: (value: any, row: T) => React.ReactNode;
};

// Address type
export interface AddressTypes {
  streetAddress: string;
  city: string;
  state: string;
  zipcode: string;
  latitude: number;
  longitude: number;
}

// Personal type
export interface PersonalTypes {
  firstName: string;
  lastName: string;
  middleName?: string;
  birthday?: string;
  birthplace?: string;
  address: AddressTypes;
  profile: string;
  age: number;
  sex: string;
  civilStatus: string;
  contact: string;
  citizenship?: string;
}

// User type
export interface UserTypes {
  password: string;
  role: 'admin' | 'user';
  userId: string;
  _id: string;
  personalData: PersonalTypes;
  email: string;
}

// Section type
export interface SectionTypes {
  _id: string;
  title: string;
  videoUrl?: string;
  description?: string;
  resource?: string;
  moduleId: string;
  sectionType?: string;
  createdAt?: Date;
  updatedAt?: Date;
  cover: '';
  isUnlock?: boolean;
}

// Module type
export interface ModuleTypes {
  _id: string;
  title: string;
  description: string;
  courseId: string; // Reference to Course
  createdAt?: Date;
  updatedAt?: Date;
  cover: '';
}

// Course type
export interface CourseTypes {
  _id: string;
  title: string;
  description: string;
  instructor: string;
  category: string;
  createdAt?: Date;
  updatedAt?: Date;
  cover: '';
}

export interface QuestionTypes {
  questionText: string;
  questionType: 'multiple-choice' | 'enumeration' | 'identification' | 'essay';
  options: string[];
  correctAnswer: string | number | string[];
  explanation: string;
  questionPoints: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface AssesmentType {
  title: string;
  description: string;
  questions: QuestionTypes[];
  moduleId: string;
  assesmentDueDate: Date;
  timeLimit: number;
  status: 'draft' | 'published';
  category: string;
}
