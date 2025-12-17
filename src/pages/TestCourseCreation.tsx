import React, { useState } from 'react';
import { CourseCreationData } from '@/types/course';
import AddCourseForm from '@/components/AddCourseForm';
import { useToast } from '@/components/ui/Toaster';
import { courseService } from '@/services/courseService';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const TestCourseCreation: React.FC = () => {
  const { addToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [createdCourses, setCreatedCourses] = useState<any[]>([]);

  const handleSaveCourse = async (courseData: CourseCreationData) => {
    try {
      console.log('Test: Saving course with data:', courseData);
      
      const createdCourse = await courseService.mockCreateCourse(courseData);
      
      console.log('Test: Course created:', createdCourse);
      
      setCreatedCourses(prev => [...prev, createdCourse]);
      
      addToast({
        type: 'success',
        title: 'Course Created Successfully!',
        message: `Course "${courseData.title}" has been created and added to the list below.`
      });
      
      setShowForm(false);
    } catch (error) {
      console.error('Test: Error creating course:', error);
      addToast({
        type: 'error',
        title: 'Failed to create course',
        message: error instanceof Error ? error.message : 'An error occurred while creating the course'
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Course Creation Test</h1>
        <p className="text-gray-600">Test the course creation functionality with debugging enabled.</p>
      </div>

      <Card>
        <Card.Content>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Course Creation Test</h2>
              <p className="text-gray-600">Click the button below to test course creation with file uploads.</p>
            </div>
            <Button onClick={() => setShowForm(true)}>
              Test Create Course
            </Button>
          </div>
        </Card.Content>
      </Card>

      {createdCourses.length > 0 && (
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold">Created Courses ({createdCourses.length})</h3>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              {createdCourses.map((course, index) => (
                <div key={course.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-lg">{course.title}</h4>
                      <p className="text-gray-600">{course.code}</p>
                      <p className="text-sm text-gray-500">{course.description}</p>
                      <div className="mt-2 text-sm">
                        <p><strong>Instructor:</strong> {course.instructor}</p>
                        <p><strong>Credits:</strong> {course.credits}</p>
                        <p><strong>Max Students:</strong> {course.maxStudents}</p>
                        <p><strong>Status:</strong> {course.status}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-500">Created #{index + 1}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>
      )}

      {showForm && (
        <AddCourseForm
          onClose={() => setShowForm(false)}
          onSave={handleSaveCourse}
        />
      )}
    </div>
  );
};

export default TestCourseCreation;



















