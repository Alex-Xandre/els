import { Request } from 'express';

export interface CustomRequest extends Request {
  user?: {
    _id: string;
    name: string;
    role: string;
  };
}

//address type
export interface AddressTypes {
  streetAddress: string;
  city: string;
  state: string;
  zipcode: string;
  latitude: number;
  longitude: number;
}

// personal
export interface PersonalTypes {
  firstName: string;
  lastName: string;
  middleName?: string;
  birthday?: string;
  birthplace?: string;
  address: AddressTypes;

  age: number;
  sex: string;
  contact: number;
}

//user types
export interface UserTypes {
  password: string;
  role: 'admin' | 'user';
  userId: string;
  personalData: PersonalTypes;
  email: string;
  profile: string;
  status:boolean
}

export interface QuestionTypes {
  _id: string;
  questionText: string;
  questionType: 'multiple-choice' | 'enumeration' | 'identification' | 'essay';
  options: string[];
  correctAnswer: string | number | string[];
  explanation: string;
  questionPoints: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface AssesmentType {
  _id: string;
  title: string;
  description: string;
  questions: QuestionTypes[];
  moduleId: string;
  assesmentDueDate: Date;
  timeLimit: number;
  status: 'draft' | 'published';
  category: string;
  cover?: string;


  sectionType?: string;
  attempts?: number;

}
