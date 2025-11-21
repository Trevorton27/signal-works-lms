/**
 * Enrollment service - Business logic for course enrollments
 */

import prisma from '@/lib/prisma';
import { logger } from '@/lib/logger';
import type { Enrollment } from '@/lib/types';

export async function enrollUser(userId: string, courseId: string): Promise<Enrollment> {
  try {
    // Check if already enrolled
    const existing = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (existing) {
      throw new Error('Already enrolled in this course');
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId,
        progress: 0,
      },
    });

    logger.info('User enrolled', { userId, courseId, enrollmentId: enrollment.id });
    return enrollment;
  } catch (error) {
    logger.error('Failed to enroll user', error, { userId, courseId });
    throw error;
  }
}

export async function getEnrollments(userId: string): Promise<Enrollment[]> {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        enrolledAt: 'desc',
      },
    });

    return enrollments as any; // TODO: Type properly with relations
  } catch (error) {
    logger.error('Failed to get enrollments', error, { userId });
    throw new Error('Failed to retrieve enrollments');
  }
}

export async function getEnrollmentById(enrollmentId: string): Promise<Enrollment | null> {
  try {
    const enrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId },
    });

    return enrollment;
  } catch (error) {
    logger.error('Failed to get enrollment', error, { enrollmentId });
    throw new Error('Failed to retrieve enrollment');
  }
}

export async function updateProgress(enrollmentId: string, progress: number): Promise<Enrollment> {
  try {
    const enrollment = await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        progress: Math.min(100, Math.max(0, progress)), // Clamp between 0-100
        completedAt: progress >= 100 ? new Date() : null,
      },
    });

    logger.info('Enrollment progress updated', { enrollmentId, progress });
    return enrollment;
  } catch (error) {
    logger.error('Failed to update progress', error, { enrollmentId, progress });
    throw new Error('Failed to update progress');
  }
}

export async function markCourseComplete(enrollmentId: string): Promise<Enrollment> {
  return updateProgress(enrollmentId, 100);
}

export async function unenroll(enrollmentId: string): Promise<void> {
  try {
    await prisma.enrollment.delete({
      where: { id: enrollmentId },
    });

    logger.info('User unenrolled', { enrollmentId });
  } catch (error) {
    logger.error('Failed to unenroll', error, { enrollmentId });
    throw new Error('Failed to unenroll');
  }
}
