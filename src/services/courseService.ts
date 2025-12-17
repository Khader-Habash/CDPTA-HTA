import { CourseCreationData, CourseAttachment, CourseDetails } from '@/types/course';
import { apiClient, apiUtils } from './apiClient';
import { realtimeService } from './realtimeService';

class CourseService {
  // Create a new course
  async createCourse(courseData: CourseCreationData): Promise<CourseDetails> {
    try {
      // Upload attachments first if any
      const uploadedAttachments = await this.uploadAttachments(courseData.attachments);
      
      // Prepare course data for API
      const coursePayload = {
        ...courseData,
        attachments: uploadedAttachments,
        // Remove file objects from payload
        resources: courseData.attachments.map(att => ({
          id: att.id,
          name: att.name,
          type: att.type,
          url: att.url || '',
          size: att.size,
          downloadable: true,
          description: att.description,
        })),
      };

      const response = await apiUtils.post<CourseDetails>('/courses', coursePayload);
      return response.data;
    } catch (error) {
      console.error('Error creating course:', error);
      throw new Error('Failed to create course. Please try again.');
    }
  }

  // Upload course attachments
  async uploadAttachments(attachments: CourseAttachment[]): Promise<CourseAttachment[]> {
    const uploadPromises = attachments.map(async (attachment) => {
      try {
        const formData = new FormData();
        formData.append('file', attachment.file);
        formData.append('type', attachment.type);
        formData.append('description', attachment.description || '');
        formData.append('isRequired', attachment.isRequired.toString());

        const response = await apiClient.post('/files/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        return {
          ...attachment,
          url: response.data.url,
        };
      } catch (error) {
        console.error(`Error uploading file ${attachment.name}:`, error);
        throw new Error(`Failed to upload ${attachment.name}`);
      }
    });

    return Promise.all(uploadPromises);
  }

  // Get all courses
  async getCourses(): Promise<CourseDetails[]> {
    try {
      const response = await apiUtils.get<CourseDetails[]>('/courses');
      return response.data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw new Error('Failed to fetch courses');
    }
  }

  // Get course by ID
  async getCourseById(courseId: string): Promise<CourseDetails> {
    try {
      const response = await apiUtils.get<CourseDetails>(`/courses/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course:', error);
      throw new Error('Failed to fetch course details');
    }
  }

  // Update course
  async updateCourse(courseId: string, courseData: Partial<CourseCreationData>): Promise<CourseDetails> {
    try {
      const response = await apiUtils.put<CourseDetails>(`/courses/${courseId}`, courseData);
      return response.data;
    } catch (error) {
      console.error('Error updating course:', error);
      throw new Error('Failed to update course');
    }
  }

  // Delete course
  async deleteCourse(courseId: string): Promise<void> {
    try {
      await apiUtils.delete(`/courses/${courseId}`);
    } catch (error) {
      console.error('Error deleting course:', error);
      throw new Error('Failed to delete course');
    }
  }

  // Publish course
  async publishCourse(courseId: string): Promise<CourseDetails> {
    try {
      const response = await apiUtils.patch<CourseDetails>(`/courses/${courseId}/publish`);
      return response.data;
    } catch (error) {
      console.error('Error publishing course:', error);
      throw new Error('Failed to publish course');
    }
  }

  // Archive course
  async archiveCourse(courseId: string): Promise<CourseDetails> {
    try {
      const response = await apiUtils.patch<CourseDetails>(`/courses/${courseId}/archive`);
      return response.data;
    } catch (error) {
      console.error('Error archiving course:', error);
      throw new Error('Failed to archive course');
    }
  }

  // Get course analytics
  async getCourseAnalytics(courseId: string) {
    try {
      const response = await apiUtils.get(`/courses/${courseId}/analytics`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course analytics:', error);
      throw new Error('Failed to fetch course analytics');
    }
  }

  // Get course students
  async getCourseStudents(courseId: string) {
    try {
      const response = await apiUtils.get(`/courses/${courseId}/students`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course students:', error);
      throw new Error('Failed to fetch course students');
    }
  }

  // Enroll student in course
  async enrollStudent(courseId: string, studentId: string) {
    try {
      const response = await apiUtils.post(`/courses/${courseId}/enroll`, { studentId });
      return response.data;
    } catch (error) {
      console.error('Error enrolling student:', error);
      throw new Error('Failed to enroll student');
    }
  }

  // Remove student from course
  async removeStudent(courseId: string, studentId: string) {
    try {
      await apiUtils.delete(`/courses/${courseId}/students/${studentId}`);
    } catch (error) {
      console.error('Error removing student:', error);
      throw new Error('Failed to remove student');
    }
  }

  // Create a new module
  async createModule(courseId: string, moduleData: {
    title: string;
    description: string;
    content: string;
    order: number;
  }) {
    try {
      const response = await apiUtils.post(`/courses/${courseId}/modules`, moduleData);
      
      // Emit realtime event for module creation
      await realtimeService.notifyModuleCreated({
        moduleId: response.data.id,
        title: moduleData.title,
        courseId,
        courseName: 'Course Name', // In real app, fetch course name
        createdBy: 'current-user-id', // In real app, get from auth context
      });
      
      return response.data;
    } catch (error) {
      console.error('Error creating module:', error);
      throw new Error('Failed to create module');
    }
  }

  // Create a new lecture
  async createLecture(courseId: string, lectureData: {
    title: string;
    description: string;
    scheduledAt: string;
    duration: number;
    location?: string;
    isOnline: boolean;
  }) {
    try {
      const response = await apiUtils.post(`/courses/${courseId}/lectures`, lectureData);
      
      // Emit realtime event for lecture creation
      await realtimeService.notifyLectureCreated({
        lectureId: response.data.id,
        title: lectureData.title,
        courseId,
        courseName: 'Course Name', // In real app, fetch course name
        scheduledAt: lectureData.scheduledAt,
        createdBy: 'current-user-id', // In real app, get from auth context
      });
      
      return response.data;
    } catch (error) {
      console.error('Error creating lecture:', error);
      throw new Error('Failed to create lecture');
    }
  }

  // Mock methods for demo purposes (when API is not available)
  async mockCreateCourse(courseData: CourseCreationData): Promise<CourseDetails> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate mock course ID
    const courseId = `course-${Date.now()}`;

    // Convert attachments to course materials for fellows to access
    const courseMaterials = courseData.attachments.map(attachment => ({
      id: attachment.id,
      name: attachment.name,
      type: attachment.type,
      size: attachment.size,
      description: attachment.description || '',
      uploadedAt: attachment.uploadedAt,
      downloadable: true,
      url: attachment.url || URL.createObjectURL(attachment.file), // Create local URL for demo
    }));

    // Store course materials in localStorage for fellows to access
    localStorage.setItem(`course_materials_${courseId}`, JSON.stringify(courseMaterials));

    // Create mock course details
    const mockCourse: CourseDetails = {
      id: courseId,
      code: courseData.code,
      title: courseData.title,
      description: courseData.description,
      instructor: courseData.instructor,
      instructors: [{
        id: courseData.instructorId,
        name: courseData.instructor,
        email: `${courseData.instructor.toLowerCase().replace(' ', '.')}@cdpta.org`,
        role: 'instructor',
      }],
      term: 'Spring 2024',
      credits: courseData.credits,
      maxStudents: courseData.maxStudents,
      enrolledStudents: 0,
      startDate: courseData.startDate,
      endDate: courseData.endDate,
      status: courseData.isPublished ? 'published' : 'draft',
      color: '#3B82F6',
      syllabus: courseData.courseOutline,
      modules: [],
      assignments: [],
      announcements: [],
      settings: {
        allowLateSubmissions: true,
        latePenalty: 10,
        showGrades: true,
        allowDiscussions: true,
        requireCompletion: true,
      },
    };

    console.log('Mock course created:', mockCourse);
    console.log('Course materials stored:', courseMaterials);
    return mockCourse;
  }

  async mockUploadAttachments(attachments: CourseAttachment[]): Promise<CourseAttachment[]> {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return attachments.map(attachment => ({
      ...attachment,
      url: URL.createObjectURL(attachment.file), // Create local URL for demo
    }));
  }

  // Mock methods for modules and lectures
  async mockCreateModule(courseId: string, moduleData: {
    title: string;
    description: string;
    content: string;
    order: number;
  }) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const moduleId = `module-${Date.now()}`;
    const mockModule = {
      id: moduleId,
      ...moduleData,
      courseId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Emit realtime event for module creation
    await realtimeService.notifyModuleCreated({
      moduleId,
      title: moduleData.title,
      courseId,
      courseName: 'Course Name', // In real app, fetch course name
      createdBy: 'current-user-id', // In real app, get from auth context
    });

    console.log('Mock module created:', mockModule);
    return mockModule;
  }

  async mockCreateLecture(courseId: string, lectureData: {
    title: string;
    description: string;
    scheduledAt: string;
    duration: number;
    location?: string;
    isOnline: boolean;
  }) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const lectureId = `lecture-${Date.now()}`;
    const mockLecture = {
      id: lectureId,
      ...lectureData,
      courseId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Emit realtime event for lecture creation
    await realtimeService.notifyLectureCreated({
      lectureId,
      title: lectureData.title,
      courseId,
      courseName: 'Course Name', // In real app, fetch course name
      scheduledAt: lectureData.scheduledAt,
      createdBy: 'current-user-id', // In real app, get from auth context
    });

    console.log('Mock lecture created:', mockLecture);
    return mockLecture;
  }
}

export const courseService = new CourseService();





