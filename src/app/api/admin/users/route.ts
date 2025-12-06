import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { clerkClient } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// GET /api/admin/users - List all users with filters (fetches from Clerk)
export async function GET(request: NextRequest) {
  try {
    await requireRole(['ADMIN']);

    const { searchParams } = new URL(request.url);
    const roleFilter = searchParams.get('role');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    // Fetch users from Clerk
    const client = await clerkClient();
    const clerkUsers = await client.users.getUserList({
      limit,
      offset,
    });

    // Filter and transform Clerk users
    let users = await Promise.all(
      clerkUsers.data.map(async (clerkUser) => {
        const userRole = clerkUser.publicMetadata?.role as string || 'STUDENT';

        // Filter by role if specified
        if (roleFilter && userRole !== roleFilter) {
          return null;
        }

        // Filter by search if specified
        if (search) {
          const searchLower = search.toLowerCase();
          const email = clerkUser.emailAddresses[0]?.emailAddress || '';
          const name = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim();

          if (!email.toLowerCase().includes(searchLower) &&
              !name.toLowerCase().includes(searchLower)) {
            return null;
          }
        }

        // Get counts from Prisma database (for enrollments, attempts, courses created)
        const counts = await prisma.user.findUnique({
          where: { id: clerkUser.id },
          select: {
            _count: {
              select: {
                enrollments: true,
                attempts: true,
                coursesCreated: true,
              },
            },
          },
        });

        // For instructors, count unique students enrolled in their courses
        let enrolledStudents = 0;
        if (userRole === 'INSTRUCTOR') {
          const result = await prisma.enrollment.findMany({
            where: {
              course: {
                instructorId: clerkUser.id,
              },
            },
            select: {
              userId: true,
            },
            distinct: ['userId'],
          });
          enrolledStudents = result.length;
        }

        // For students, get their current enrollment and assessment data
        let currentEnrollment = null;
        let assessmentLevel = 'Beginner';
        if (userRole === 'STUDENT') {
          // Get most recent enrollment
          const enrollment = await prisma.enrollment.findFirst({
            where: { userId: clerkUser.id },
            orderBy: { enrolledAt: 'desc' },
            include: {
              course: {
                select: {
                  title: true,
                },
              },
            },
          });

          if (enrollment) {
            currentEnrollment = {
              id: enrollment.id,
              courseTitle: enrollment.course.title,
              startDate: enrollment.enrolledAt.toISOString(),
              finishDate: enrollment.completedAt?.toISOString() || null,
              progress: enrollment.progress,
            };
          }

          // Calculate assessment level based on attempts
          const attemptStats = await prisma.attempt.aggregate({
            where: { userId: clerkUser.id },
            _avg: { score: true },
            _count: { id: true },
          });

          if (attemptStats._count.id > 0) {
            const avgScore = attemptStats._avg.score || 0;
            if (avgScore >= 80) assessmentLevel = 'Advanced';
            else if (avgScore >= 60) assessmentLevel = 'Intermediate';
            else assessmentLevel = 'Beginner';
          }
        }

        // Construct name with fallbacks
        const firstName = clerkUser.firstName || '';
        const lastName = clerkUser.lastName || '';
        const fullName = `${firstName} ${lastName}`.trim();
        const email = clerkUser.emailAddresses[0]?.emailAddress || '';
        const username = clerkUser.username;

        // Use full name, or username, or email prefix as fallback
        let displayName = fullName || username || email.split('@')[0] || null;

        return {
          id: clerkUser.id,
          email,
          name: displayName,
          role: userRole,
          avatarUrl: clerkUser.imageUrl,
          createdAt: new Date(clerkUser.createdAt).toISOString(),
          updatedAt: new Date(clerkUser.updatedAt).toISOString(),
          _count: counts?._count || {
            enrollments: 0,
            attempts: 0,
            coursesCreated: 0,
          },
          enrolledStudents,
          currentEnrollment,
          assessmentLevel,
        };
      })
    );

    // Remove null entries (filtered out users)
    users = users.filter(user => user !== null);

    return NextResponse.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total: clerkUsers.totalCount,
          totalPages: Math.ceil(clerkUsers.totalCount / limit),
        },
      },
    });
  } catch (error: any) {
    console.error('Error fetching users from Clerk:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch users' },
      { status: error.message?.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

// POST /api/admin/users - Create new user
// NOTE: User creation is handled by Clerk
// Users should be created through Clerk's dashboard or API
// This endpoint is disabled for Clerk-based authentication
export async function POST(request: NextRequest) {
  try {
    await requireRole(['ADMIN']);

    return NextResponse.json(
      {
        success: false,
        error: 'User creation is managed through Clerk. Please use Clerk Dashboard or Clerk API to create users.',
        clerkDashboard: 'https://dashboard.clerk.com'
      },
      { status: 501 } // Not Implemented
    );
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process request' },
      { status: error.message?.includes('Unauthorized') ? 401 : 500 }
    );
  }
}
