import cron from 'node-cron';
import { endExpiredCourses, purgeExpiredCourses } from '../services/courseLifecycle.service.js';

function scheduleCourseLifecycleJobs() {
  cron.schedule('0 0 * * *', async () => {
    try {
      await endExpiredCourses();
    } catch (error) {
      console.error('강좌 자동 종료 실패', error);
    }
  });

  cron.schedule('0 0 * * *', async () => {
    try {
      await purgeExpiredCourses();
    } catch (error) {
      console.error('종료된 강좌 완전 삭제 실패', error);
    }
  });
}

export { scheduleCourseLifecycleJobs };
