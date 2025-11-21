import { NextRequest, NextResponse } from 'next/server';
import { getCourseById } from '@/server/lms/courseService';
import { logger } from '@/lib/logger';

export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const course = await getCourseById(params.courseId);

    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: course,
    });
  } catch (error) {
    logger.error('GET /api/lms/courses/[courseId] failed', error, { courseId: params.courseId });
    return NextResponse.json(
      { success: false, error: 'Failed to fetch course' },
      { status: 500 }
    );
  }
}
