'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface LessonViewProps {
  lessonId: string;
  courseId: string;
}

export default function LessonView({ lessonId, courseId }: LessonViewProps) {
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Implement lesson fetching via API
    // For now, mock data
    setLesson({
      id: lessonId,
      title: 'Sample Lesson',
      content: 'This is the lesson content. In a real implementation, this would be fetched from the API and could include markdown, videos, and interactive elements.',
      videoUrl: null,
      duration: 30,
    });
    setLoading(false);
  }, [lessonId]);

  if (loading) {
    return <div className="text-center py-12">Loading lesson...</div>;
  }

  if (!lesson) {
    return <div className="text-center py-12 text-red-600">Lesson not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4">
        <Link href={`/courses/${courseId}`} className="text-indigo-600 hover:underline">
          &larr; Back to Course
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{lesson.title}</h1>

        {lesson.videoUrl && (
          <div className="mb-6">
            <video controls className="w-full rounded-lg" src={lesson.videoUrl} />
          </div>
        )}

        <div className="prose max-w-none">
          <p className="text-gray-700 whitespace-pre-wrap">{lesson.content}</p>
        </div>

        <div className="mt-8 pt-6 border-t">
          <Link
            href="/assessment"
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Practice with AI Assessment
          </Link>
        </div>
      </div>
    </div>
  );
}
