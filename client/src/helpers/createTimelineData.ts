import { TimelineActivityType } from './types';

export const createTimelineData = (overrides: Partial<TimelineActivityType>): TimelineActivityType => ({
  user: '',
  course: '',
  module: '',
  section: '',
  activity: '',
  activityType: 'viewed',
  text: '',
  ...overrides,
});
