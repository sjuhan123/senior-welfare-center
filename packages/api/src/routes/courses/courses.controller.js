import { getCoursesByWelfare, createCourse, updateCourse } from '../../models/course/course.model.js';
import { createRoom } from '../../models/room/room.model.js';
import { getEnrollmentsByCourse, updateEnrollmentState, updateEnrollmentsState } from '../../models/enrollment/enrollment.model.js';
import { endCourse } from '../../services/courseLifecycle.service.js';

const ENROLLMENT_STATES = ['accepted', 'rejected', 'dropped'];

async function httpGetCourses(req, res) {
  try {
    const { welfareId } = req.params;

    const courses = await getCoursesByWelfare(welfareId);

    return res.status(200).json({
      statusCode: 200,
      message: '강좌 목록 조회 성공',
      data: courses,
    });
  } catch (error) {
    console.error('Error retrieving courses:', error);
    return res.status(500).json({
      statusCode: 500,
      message: '서버 오류',
      error: error.message,
    });
  }
}

async function httpPostCourse(req, res) {
  try {
    const { welfareId } = req.params;
    const { name, when, place, teacher, cap, from, to, rooms, availableFrom, availableTo } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ statusCode: 400, message: '강좌명을 입력하세요' });
    }
    if (!from || !to) {
      return res.status(400).json({ statusCode: 400, message: '시작일과 종료일을 입력하세요' });
    }

    const course = await createCourse(welfareId, { name, when, place, cap, from, to, teacher: teacher || null });

    await createRoom({ welfare: welfareId, course: course._id, type: 'notice' });
    if ((rooms || []).includes('chat')) {
      await createRoom({ welfare: welfareId, course: course._id, type: 'chat', availableFrom, availableTo });
    }
    if ((rooms || []).includes('feed')) {
      await createRoom({ welfare: welfareId, course: course._id, type: 'feed', availableFrom, availableTo });
    }

    return res.status(201).json({
      statusCode: 201,
      message: '강좌 등록 성공',
      data: course,
    });
  } catch (error) {
    console.error('Error creating course:', error);
    return res.status(500).json({
      statusCode: 500,
      message: '서버 오류',
      error: error.message,
    });
  }
}

async function httpPatchCourse(req, res) {
  try {
    const { courseId } = req.params;
    const { name, when, place, teacher, cap, from, to, updatedAt } = req.body;

    const fields = {};
    if (name !== undefined) fields.name = name;
    if (when !== undefined) fields.when = when;
    if (place !== undefined) fields.place = place;
    if (teacher !== undefined) fields.teacher = teacher;
    if (cap !== undefined) fields.cap = cap;
    if (from !== undefined) fields.from = from;
    if (to !== undefined) fields.to = to;

    const { result, doc } = await updateCourse(courseId, updatedAt, fields);

    if (result === 'not_found') {
      return res.status(404).json({ statusCode: 404, message: '해당 강좌를 찾을 수 없습니다' });
    }

    if (result === 'conflict') {
      return res.status(409).json({ statusCode: 409, message: '다른 관리자가 이미 변경했습니다' });
    }

    if (doc.to && new Date(doc.to) < new Date() && !doc.endedAt) {
      await endCourse(courseId);
    }

    return res.status(200).json({
      statusCode: 200,
      message: '강좌 수정 성공',
      data: doc,
    });
  } catch (error) {
    console.error('Error updating course:', error);
    return res.status(500).json({
      statusCode: 500,
      message: '서버 오류',
      error: error.message,
    });
  }
}

async function httpDeleteCourse(req, res) {
  try {
    const { courseId } = req.params;

    await endCourse(courseId);

    return res.status(200).json({
      statusCode: 200,
      message: '강좌 삭제 성공',
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    return res.status(500).json({
      statusCode: 500,
      message: '서버 오류',
      error: error.message,
    });
  }
}

async function httpGetEnrollments(req, res) {
  try {
    const { courseId } = req.params;

    const enrollments = await getEnrollmentsByCourse(courseId);

    return res.status(200).json({
      statusCode: 200,
      message: '신청자 목록 조회 성공',
      data: enrollments,
    });
  } catch (error) {
    console.error('Error retrieving enrollments:', error);
    return res.status(500).json({
      statusCode: 500,
      message: '서버 오류',
      error: error.message,
    });
  }
}

async function httpPatchEnrollment(req, res) {
  try {
    const { enrollmentId } = req.params;
    const { state } = req.body;

    if (!ENROLLMENT_STATES.includes(state)) {
      return res.status(400).json({ statusCode: 400, message: '잘못된 상태값입니다' });
    }

    const enrollment = await updateEnrollmentState(enrollmentId, state);

    if (!enrollment) {
      return res.status(404).json({ statusCode: 404, message: '해당 신청을 찾을 수 없습니다' });
    }

    return res.status(200).json({
      statusCode: 200,
      message: '처리 완료',
      data: enrollment,
    });
  } catch (error) {
    console.error('Error updating enrollment:', error);
    return res.status(500).json({
      statusCode: 500,
      message: '서버 오류',
      error: error.message,
    });
  }
}

async function httpPatchEnrollmentsBulk(req, res) {
  try {
    const { enrollmentIds, state } = req.body;

    if (!Array.isArray(enrollmentIds) || !enrollmentIds.length) {
      return res.status(400).json({ statusCode: 400, message: '처리할 신청을 선택하세요' });
    }
    if (!ENROLLMENT_STATES.includes(state)) {
      return res.status(400).json({ statusCode: 400, message: '잘못된 상태값입니다' });
    }

    await updateEnrollmentsState(enrollmentIds, state);

    return res.status(200).json({
      statusCode: 200,
      message: '일괄 처리 완료',
    });
  } catch (error) {
    console.error('Error updating enrollments:', error);
    return res.status(500).json({
      statusCode: 500,
      message: '서버 오류',
      error: error.message,
    });
  }
}

export { httpGetCourses, httpPostCourse, httpPatchCourse, httpDeleteCourse, httpGetEnrollments, httpPatchEnrollment, httpPatchEnrollmentsBulk };
