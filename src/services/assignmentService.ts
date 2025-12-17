import { AssignmentCreationData, QuizCreationData, CourseManagementAssignment, AssignmentAttachment } from '@/types/courseManagement';
import { apiClient, apiUtils } from './apiClient';
import { realtimeService } from './realtimeService';

class AssignmentService {
  // Create a new assignment
  async createAssignment(assignmentData: AssignmentCreationData): Promise<CourseManagementAssignment> {
    try {
      // Upload attachments first if any
      const uploadedAttachments = await this.uploadAttachments(assignmentData.attachments);
      
      // Prepare assignment data for API
      const assignmentPayload = {
        ...assignmentData,
        attachments: uploadedAttachments,
      };

      const response = await apiUtils.post<CourseManagementAssignment>('/assignments', assignmentPayload);
      
      // Emit realtime event for assignment creation
      await realtimeService.notifyAssignmentCreated({
        assignmentId: response.data.id,
        title: response.data.title,
        courseId: response.data.courseId,
        courseName: 'Course Name', // In real app, fetch course name
        dueDate: response.data.dueDate,
        createdBy: 'current-user-id', // In real app, get from auth context
      });
      
      return response.data;
    } catch (error) {
      console.error('Error creating assignment:', error);
      throw new Error('Failed to create assignment. Please try again.');
    }
  }

  // Create a new quiz
  async createQuiz(quizData: QuizCreationData): Promise<CourseManagementAssignment> {
    try {
      // Upload attachments first if any
      const uploadedAttachments = await this.uploadAttachments(quizData.attachments);
      
      // Prepare quiz data for API
      const quizPayload = {
        ...quizData,
        attachments: uploadedAttachments,
        type: 'quiz' as const,
      };

      const response = await apiUtils.post<CourseManagementAssignment>('/assignments', quizPayload);
      
      // Emit realtime event for quiz creation
      await realtimeService.notifyQuizCreated({
        quizId: response.data.id,
        title: response.data.title,
        courseId: response.data.courseId,
        courseName: 'Course Name', // In real app, fetch course name
        dueDate: response.data.dueDate,
        createdBy: 'current-user-id', // In real app, get from auth context
      });
      
      return response.data;
    } catch (error) {
      console.error('Error creating quiz:', error);
      throw new Error('Failed to create quiz. Please try again.');
    }
  }

  // Upload assignment attachments
  async uploadAttachments(attachments: AssignmentAttachment[]): Promise<AssignmentAttachment[]> {
    const uploadPromises = attachments.map(async (attachment) => {
      try {
        // In a real app, you would upload the file to a server
        // For demo purposes, we'll simulate the upload
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return {
          ...attachment,
          url: attachment.url || URL.createObjectURL(new Blob()), // Mock URL
        };
      } catch (error) {
        console.error(`Error uploading file ${attachment.filename}:`, error);
        throw new Error(`Failed to upload ${attachment.filename}`);
      }
    });

    return Promise.all(uploadPromises);
  }

  // Get all assignments for a course
  async getCourseAssignments(courseId: string): Promise<CourseManagementAssignment[]> {
    try {
      const response = await apiUtils.get<CourseManagementAssignment[]>(`/courses/${courseId}/assignments`);
      return response.data;
    } catch (error) {
      console.error('Error fetching assignments:', error);
      throw new Error('Failed to fetch assignments');
    }
  }

  // Get assignment by ID
  async getAssignmentById(assignmentId: string): Promise<CourseManagementAssignment> {
    try {
      const response = await apiUtils.get<CourseManagementAssignment>(`/assignments/${assignmentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching assignment:', error);
      throw new Error('Failed to fetch assignment details');
    }
  }

  // Update assignment
  async updateAssignment(assignmentId: string, assignmentData: Partial<AssignmentCreationData>): Promise<CourseManagementAssignment> {
    try {
      const response = await apiUtils.put<CourseManagementAssignment>(`/assignments/${assignmentId}`, assignmentData);
      return response.data;
    } catch (error) {
      console.error('Error updating assignment:', error);
      throw new Error('Failed to update assignment');
    }
  }

  // Delete assignment
  async deleteAssignment(assignmentId: string): Promise<void> {
    try {
      await apiUtils.delete(`/assignments/${assignmentId}`);
    } catch (error) {
      console.error('Error deleting assignment:', error);
      throw new Error('Failed to delete assignment');
    }
  }

  // Publish assignment
  async publishAssignment(assignmentId: string): Promise<CourseManagementAssignment> {
    try {
      const response = await apiUtils.patch<CourseManagementAssignment>(`/assignments/${assignmentId}/publish`);
      return response.data;
    } catch (error) {
      console.error('Error publishing assignment:', error);
      throw new Error('Failed to publish assignment');
    }
  }

  // Close assignment
  async closeAssignment(assignmentId: string): Promise<CourseManagementAssignment> {
    try {
      const response = await apiUtils.patch<CourseManagementAssignment>(`/assignments/${assignmentId}/close`);
      return response.data;
    } catch (error) {
      console.error('Error closing assignment:', error);
      throw new Error('Failed to close assignment');
    }
  }

  // Get assignment submissions
  async getAssignmentSubmissions(assignmentId: string) {
    try {
      const response = await apiUtils.get(`/assignments/${assignmentId}/submissions`);
      return response.data;
    } catch (error) {
      console.error('Error fetching submissions:', error);
      throw new Error('Failed to fetch submissions');
    }
  }

  // Grade submission
  async gradeSubmission(submissionId: string, grade: number, feedback?: string) {
    try {
      const response = await apiUtils.patch(`/submissions/${submissionId}/grade`, {
        grade,
        feedback,
      });
      return response.data;
    } catch (error) {
      console.error('Error grading submission:', error);
      throw new Error('Failed to grade submission');
    }
  }

  // Mock methods for demo purposes (when API is not available)
  async mockCreateAssignment(assignmentData: AssignmentCreationData): Promise<CourseManagementAssignment> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate mock assignment ID
    const assignmentId = `assignment-${Date.now()}`;

    // Create mock assignment
    const mockAssignment: CourseManagementAssignment = {
      id: assignmentId,
      courseId: assignmentData.courseId,
      title: assignmentData.title,
      description: assignmentData.description,
      type: assignmentData.type,
      instructions: assignmentData.instructions,
      dueDate: assignmentData.dueDate,
      totalPoints: assignmentData.totalPoints,
      timeLimit: assignmentData.timeLimit,
      attempts: 0,
      status: assignmentData.isPublished ? 'published' : 'draft',
      attachments: assignmentData.attachments,
      submissions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log('Mock assignment created:', mockAssignment);
    
    // Emit realtime event for assignment creation
    await realtimeService.notifyAssignmentCreated({
      assignmentId: mockAssignment.id,
      title: mockAssignment.title,
      courseId: mockAssignment.courseId,
      courseName: 'Course Name', // In real app, fetch course name
      dueDate: mockAssignment.dueDate,
      createdBy: 'current-user-id', // In real app, get from auth context
    });
    
    return mockAssignment;
  }

  async mockCreateQuiz(quizData: QuizCreationData): Promise<CourseManagementAssignment> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate mock quiz ID
    const quizId = `quiz-${Date.now()}`;

    // Create mock quiz
    const mockQuiz: CourseManagementAssignment = {
      id: quizId,
      courseId: quizData.courseId,
      title: quizData.title,
      description: quizData.description,
      type: 'quiz',
      instructions: quizData.instructions,
      dueDate: quizData.dueDate,
      totalPoints: quizData.totalPoints,
      timeLimit: quizData.timeLimit,
      attempts: 0,
      status: quizData.isPublished ? 'published' : 'draft',
      questions: quizData.questions,
      attachments: quizData.attachments,
      submissions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log('Mock quiz created:', mockQuiz);
    
    // Emit realtime event for quiz creation
    await realtimeService.notifyQuizCreated({
      quizId: mockQuiz.id,
      title: mockQuiz.title,
      courseId: mockQuiz.courseId,
      courseName: 'Course Name', // In real app, fetch course name
      dueDate: mockQuiz.dueDate,
      createdBy: 'current-user-id', // In real app, get from auth context
    });
    
    return mockQuiz;
  }

  async mockUploadAttachments(attachments: AssignmentAttachment[]): Promise<AssignmentAttachment[]> {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return attachments.map(attachment => ({
      ...attachment,
      url: attachment.url || URL.createObjectURL(new Blob()), // Create local URL for demo
    }));
  }
}

export const assignmentService = new AssignmentService();





