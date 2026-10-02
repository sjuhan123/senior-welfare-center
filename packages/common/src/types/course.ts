export type Weekday = 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';

export type ScheduleItem = { day: Weekday; startTime: string; endTime: string };

export type CourseData = {
  _id: string;
  welfare: string;
  name: string;
  schedule: ScheduleItem[];
  place: string;
  cap: number;
  from: string;
  to: string;
  teacher: string | null;
  endedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CourseListResponse = {
  statusCode: number;
  message: string;
  data: CourseData[];
};

export type CourseDetailResponse = {
  statusCode: number;
  message: string;
  data: CourseData;
};

export type EnrollmentState = 'pending' | 'accepted' | 'rejected' | 'dropped';

export type EnrollmentData = {
  _id: string;
  course: string;
  userId: string;
  userName: string;
  state: EnrollmentState;
  createdAt: string;
  updatedAt: string;
};

export type EnrollmentListResponse = {
  statusCode: number;
  message: string;
  data: EnrollmentData[];
};

export type MyEnrollmentEntry = {
  _id: string;
  course: string;
  state: EnrollmentState;
};

export type MyEnrollmentsResponse = {
  statusCode: number;
  message: string;
  data: MyEnrollmentEntry[];
};

export type PendingEnrollmentCount = {
  courseId: string;
  courseName: string;
  count: number;
};

export type PendingEnrollmentCountsResponse = {
  statusCode: number;
  message: string;
  data: PendingEnrollmentCount[];
};
