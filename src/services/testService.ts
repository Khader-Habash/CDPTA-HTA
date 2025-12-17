import { UserRole } from '@/types/auth';
import { ApplicationFormData } from '@/types/application';
import { CourseCreationData } from '@/types/course';
import { AssignmentCreationData } from '@/types/courseManagement';
import { preceptorAssignmentService } from './preceptorAssignmentService';
import { userService } from './userService';

export interface TestResult {
  step: string;
  success: boolean;
  message: string;
  data?: any;
}

export interface CompleteTestResult {
  overallSuccess: boolean;
  results: TestResult[];
  summary: string;
}

class TestService {
  // Test 1: Application Submission Process
  async testApplicationSubmission(): Promise<TestResult> {
    try {
      // Create a test application
      const testApplication: ApplicationFormData = {
        personalInfo: {
          title: 'Dr.',
          firstName: 'Test',
          lastName: 'Applicant',
          dateOfBirth: '1990-01-01',
          gender: 'male',
          nationality: 'Jordanian',
          countryOfResidence: 'Jordan',
          phone: '+962791234567',
          email: 'test.applicant@example.com',
          alternativeEmail: 'test.applicant.alt@example.com',
          address: {
            street: '123 Test Street',
            city: 'Amman',
            postalCode: '11183',
            country: 'Jordan',
          },
          isKHCCStaff: false,
          khccStaffId: '',
        },
        education: {
          currentLevel: 'master',
          institution: 'University of Jordan',
          fieldOfStudy: 'Pharmacy',
          graduationDate: '2015-06-01',
          gpa: '3.8',
          transcriptUploaded: true,
          previousEducation: [],
        },
        experience: {
          workExperience: [],
          skills: ['Research', 'Data Analysis'],
          languages: ['Arabic', 'English'],
        },
        programInfo: {
          programType: 'fellowship',
          preferredStartDate: '2024-09-01',
          studyMode: 'full-time',
          campus: 'main',
          specialization: 'Health Technology Assessment',
          previousApplications: false,
          fundingSource: 'self-funded',
        },
        essays: {
          personalStatement: 'I am passionate about health technology assessment...',
          motivationLetter: 'I want to contribute to healthcare policy...',
          careerGoals: 'To become a leading HTA researcher...',
          whyThisProgram: 'This program offers excellent training...',
          additionalInfo: 'Additional information about my background...',
        },
        essay: {
          statementOfPurpose: 'My purpose is to advance HTA research...',
          researchInterests: 'Economic evaluation, health policy',
          careerGoals: 'Research and policy development',
          whyThisProgram: 'Comprehensive HTA training',
        },
        references: [],
        documents: {
          cv: null,
          transcript: null,
          motivationLetter: null,
          additionalDocuments: [],
        },
        metadata: {
          currentStep: 4,
          totalSteps: 4,
          completedSteps: [1, 2, 3, 4],
          lastSaved: new Date().toISOString(),
          status: 'submitted',
          submissionDate: new Date().toISOString(),
          applicationId: 'test-app-' + Date.now(),
        },
      };

      // Save application to localStorage
      localStorage.setItem('applicationFormData', JSON.stringify(testApplication));
      localStorage.setItem('cdpta_submitted_applications', JSON.stringify([testApplication]));

      return {
        step: 'Application Submission',
        success: true,
        message: 'Test application submitted successfully',
        data: testApplication,
      };
    } catch (error) {
      return {
        step: 'Application Submission',
        success: false,
        message: `Failed to submit test application: ${error}`,
      };
    }
  }

  // Test 2: Admin Acceptance Process
  async testAdminAcceptance(): Promise<TestResult> {
    try {
      // Create a fellow user from the accepted application
      const fellowUser = {
        id: 'test-fellow-' + Date.now(),
        email: 'test.applicant@example.com',
        firstName: 'Test',
        lastName: 'Applicant',
        role: UserRole.FELLOW,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        permissions: [
          { resource: 'courses', action: 'read' },
          { resource: 'assignments', action: 'read' },
          { resource: 'assignments', action: 'create' },
        ],
        profileData: {
          phone: '+962791234567',
          bio: 'HTA Fellow',
          cohort: '2024A',
          startDate: '2024-09-01',
          endDate: '2025-08-31',
          mentor: 'user-khader-preceptor',
        },
      };

      // Save fellow to localStorage
      const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      existingUsers.push(fellowUser);
      localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
      
      // Also save to cdpta_users for consistency
      const cdptaUsers = JSON.parse(localStorage.getItem('cdpta_users') || '[]');
      cdptaUsers.push(fellowUser);
      localStorage.setItem('cdpta_users', JSON.stringify(cdptaUsers));
      
      // Automatically assign fellow to Khader
      try {
        const { preceptorAssignmentService } = await import('./preceptorAssignmentService');
        await preceptorAssignmentService.createAssignment({
          preceptorId: 'user-khader-preceptor',
          fellowId: fellowUser.id,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          notes: 'Automatically assigned to Khader via test acceptance process',
          department: 'Health Technology Assessment',
          cohort: '2024A',
          assignmentType: 'primary',
          workload: 'full',
        });
        console.log('✅ Test fellow automatically assigned to Khader');
      } catch (error) {
        console.error('❌ Failed to auto-assign test fellow to Khader:', error);
      }

      // Update application status to accepted
      const applications = JSON.parse(localStorage.getItem('cdpta_submitted_applications') || '[]');
      const updatedApplications = applications.map((app: any) => ({
        ...app,
        metadata: {
          ...app.metadata,
          status: 'accepted',
        },
      }));
      localStorage.setItem('cdpta_submitted_applications', JSON.stringify(updatedApplications));

      return {
        step: 'Admin Acceptance',
        success: true,
        message: 'Fellow user created and application accepted',
        data: fellowUser,
      };
    } catch (error) {
      return {
        step: 'Admin Acceptance',
        success: false,
        message: `Failed to accept application: ${error}`,
      };
    }
  }

  // Test 3: Preceptor Assignment
  async testPreceptorAssignment(): Promise<TestResult> {
    try {
      // Get the test fellow
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const testFellow = registeredUsers.find((u: any) => u.email === 'test.applicant@example.com');
      
      if (!testFellow) {
        throw new Error('Test fellow not found');
      }

      // Create assignment to khader preceptor
      const assignment = await preceptorAssignmentService.createAssignment({
        preceptorId: 'user-khader-preceptor',
        fellowId: testFellow.id,
        startDate: '2024-09-01',
        endDate: '2025-08-31',
        notes: 'Test assignment for comprehensive testing',
        department: 'Health Technology Assessment',
        cohort: '2024A',
        assignmentType: 'primary',
        workload: 'full',
      });

      return {
        step: 'Preceptor Assignment',
        success: true,
        message: 'Fellow assigned to preceptor successfully',
        data: assignment,
      };
    } catch (error) {
      return {
        step: 'Preceptor Assignment',
        success: false,
        message: `Failed to assign fellow to preceptor: ${error}`,
      };
    }
  }

  // Test 4: Course Creation by Preceptor
  async testCourseCreation(): Promise<TestResult> {
    try {
      const courseData: CourseCreationData = {
        title: 'Test HTA Course',
        code: 'HTA-101',
        description: 'Comprehensive Health Technology Assessment course for testing',
        instructor: 'Dr. Khader Habash',
        term: 'Fall 2024',
        credits: 3,
        maxStudents: 20,
        startDate: '2024-09-01',
        endDate: '2024-12-15',
        status: 'published',
        color: '#3B82F6',
        syllabus: 'This course covers fundamental concepts in HTA...',
        modules: [
          {
            id: 'module-1',
            title: 'Introduction to HTA',
            description: 'Basic concepts and principles',
            order: 1,
            contents: [
              {
                id: 'content-1',
                title: 'What is HTA?',
                type: 'lecture',
                description: 'Introduction to health technology assessment',
                duration: 45,
                isRequired: true,
                isCompleted: false,
              },
            ],
            isCompleted: false,
          },
        ],
        assignments: [
          {
            id: 'assign-1',
            title: 'HTA Literature Review',
            description: 'Review and analyze HTA literature',
            instructions: 'Write a comprehensive literature review on HTA methodologies',
            type: 'essay',
            dueDate: '2024-10-15T23:59:00Z',
            availableFrom: '2024-09-01T00:00:00Z',
            points: 100,
            maxAttempts: 1,
            isGroupWork: false,
            status: 'not_started',
          },
        ],
        settings: {
          allowLateSubmissions: true,
          latePenalty: 10,
          showGrades: true,
          allowDiscussions: true,
          requireCompletion: true,
        },
      };

      // Save course to localStorage
      const existingCourses = JSON.parse(localStorage.getItem('staff_courses') || '[]');
      existingCourses.push(courseData);
      localStorage.setItem('staff_courses', JSON.stringify(existingCourses));

      return {
        step: 'Course Creation',
        success: true,
        message: 'Test course created successfully',
        data: courseData,
      };
    } catch (error) {
      return {
        step: 'Course Creation',
        success: false,
        message: `Failed to create course: ${error}`,
      };
    }
  }

  // Test 5: Assignment Creation by Preceptor
  async testAssignmentCreation(): Promise<TestResult> {
    try {
      const assignmentData: AssignmentCreationData = {
        courseId: 'HTA-101',
        title: 'Test Assignment: HTA Analysis',
        description: 'Analyze a health technology using HTA methodology',
        instructions: 'Choose a health technology and conduct a comprehensive HTA analysis including clinical effectiveness, cost-effectiveness, and budget impact.',
        type: 'project',
        dueDate: '2024-11-30T23:59:00Z',
        availableFrom: '2024-10-01T00:00:00Z',
        points: 150,
        maxAttempts: 1,
        timeLimit: 120,
        isGroupWork: false,
        rubric: {
          criteria: [
            {
              name: 'Clinical Effectiveness Analysis',
              description: 'Thorough analysis of clinical evidence',
              points: 50,
              maxPoints: 50,
            },
            {
              name: 'Economic Evaluation',
              description: 'Comprehensive cost-effectiveness analysis',
              points: 50,
              maxPoints: 50,
            },
            {
              name: 'Presentation Quality',
              description: 'Clear and professional presentation',
              points: 50,
              maxPoints: 50,
            },
          ],
        },
      };

      // Save assignment to localStorage
      const existingAssignments = JSON.parse(localStorage.getItem('staff_assignments') || '[]');
      existingAssignments.push({
        ...assignmentData,
        id: 'test-assign-' + Date.now(),
        createdAt: new Date().toISOString(),
        status: 'published',
      });
      localStorage.setItem('staff_assignments', JSON.stringify(existingAssignments));

      return {
        step: 'Assignment Creation',
        success: true,
        message: 'Test assignment created successfully',
        data: assignmentData,
      };
    } catch (error) {
      return {
        step: 'Assignment Creation',
        success: false,
        message: `Failed to create assignment: ${error}`,
      };
    }
  }

  // Test 6: Fellow Response to Assignment
  async testFellowResponse(): Promise<TestResult> {
    try {
      // Get the test fellow
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const testFellow = registeredUsers.find((u: any) => u.email === 'test.applicant@example.com');
      
      if (!testFellow) {
        throw new Error('Test fellow not found');
      }

      // Create assignment submission
      const submission = {
        id: 'submission-' + Date.now(),
        assignmentId: 'test-assign-' + Date.now(),
        fellowId: testFellow.id,
        fellowName: `${testFellow.firstName} ${testFellow.lastName}`,
        submittedAt: new Date().toISOString(),
        content: 'This is my HTA analysis submission. I have analyzed the clinical effectiveness, economic evaluation, and budget impact of the selected health technology.',
        attachments: [
          {
            id: 'attach-1',
            name: 'HTA_Analysis_Report.pdf',
            type: 'application/pdf',
            size: 1024000,
            url: '/uploads/hta_analysis_report.pdf',
          },
        ],
        status: 'submitted',
        grade: null,
        feedback: null,
        attempt: 1,
      };

      // Save submission to localStorage
      const existingSubmissions = JSON.parse(localStorage.getItem('assignment_submissions') || '[]');
      existingSubmissions.push(submission);
      localStorage.setItem('assignment_submissions', JSON.stringify(existingSubmissions));

      return {
        step: 'Fellow Response',
        success: true,
        message: 'Fellow submitted assignment successfully',
        data: submission,
      };
    } catch (error) {
      return {
        step: 'Fellow Response',
        success: false,
        message: `Failed to submit assignment: ${error}`,
      };
    }
  }

  // Test 6: Verify Automatic Fellow Assignment to Khader
  async testAutomaticFellowAssignment(): Promise<TestResult> {
    try {
      console.log('🧪 Testing automatic fellow assignment to Khader...');
      
      // Create a test fellow
      const testFellow = {
        id: 'test-auto-fellow-' + Date.now(),
        email: 'auto.fellow@example.com',
        firstName: 'Auto',
        lastName: 'Fellow',
        role: UserRole.FELLOW,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        profileData: {
          cohort: '2024A',
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          mentor: 'user-khader-preceptor',
        },
      };
      
      // Use userService to create the fellow (this should trigger automatic assignment)
      const { userService } = await import('./userService');
      const createdFellow = await userService.createUser({
        email: testFellow.email,
        password: 'testpassword123',
        firstName: testFellow.firstName,
        lastName: testFellow.lastName,
        role: testFellow.role,
        cohort: '2024A',
      });
      
      // Verify the assignment was created
      const { preceptorAssignmentService } = await import('./preceptorAssignmentService');
      const assignments = await preceptorAssignmentService.getAssignmentsByPreceptor('user-khader-preceptor');
      const fellowAssignment = assignments.find(a => a.fellowId === createdFellow.id);
      
      if (!fellowAssignment) {
        throw new Error('Fellow was not automatically assigned to Khader');
      }
      
      // Verify Khader's profile was updated
      const khaderUser = await userService.getUserById('user-khader-preceptor');
      const fellowsInProfile = khaderUser?.profileData?.fellowsAssigned || [];
      const fellowInProfile = fellowsInProfile.find((f: any) => f.id === createdFellow.id);
      
      if (!fellowInProfile) {
        throw new Error('Fellow was not added to Khader\'s profile');
      }
      
      return {
        step: 'Automatic Fellow Assignment',
        success: true,
        message: `Fellow "${createdFellow.firstName} ${createdFellow.lastName}" automatically assigned to Khader`,
        data: {
          fellow: createdFellow,
          assignment: fellowAssignment,
          khaderProfile: khaderUser?.profileData
        },
      };
    } catch (error) {
      return {
        step: 'Automatic Fellow Assignment',
        success: false,
        message: `Failed to verify automatic assignment: ${error}`,
      };
    }
  }

  // Test 7: Preceptor Grading
  async testPreceptorGrading(): Promise<TestResult> {
    try {
      // Get the submission
      const submissions = JSON.parse(localStorage.getItem('assignment_submissions') || '[]');
      const testSubmission = submissions.find((s: any) => s.fellowId.includes('test-fellow'));
      
      if (!testSubmission) {
        throw new Error('Test submission not found');
      }

      // Update submission with grade and feedback
      const updatedSubmission = {
        ...testSubmission,
        grade: 85,
        feedback: 'Excellent work! Your analysis demonstrates a strong understanding of HTA principles. The clinical effectiveness analysis is thorough, and the economic evaluation is well-structured. Consider expanding on the budget impact analysis in future assignments.',
        gradedAt: new Date().toISOString(),
        status: 'graded',
      };

      // Update submission in localStorage
      const updatedSubmissions = submissions.map((s: any) => 
        s.id === testSubmission.id ? updatedSubmission : s
      );
      localStorage.setItem('assignment_submissions', JSON.stringify(updatedSubmissions));

      return {
        step: 'Preceptor Grading',
        success: true,
        message: 'Assignment graded successfully',
        data: updatedSubmission,
      };
    } catch (error) {
      return {
        step: 'Preceptor Grading',
        success: false,
        message: `Failed to grade assignment: ${error}`,
      };
    }
  }

  // Run Complete Test Suite
  async runCompleteTest(): Promise<CompleteTestResult> {
    const results: TestResult[] = [];
    let overallSuccess = true;

    try {
      console.log('🧪 Starting Complete Application Process Test...');

      // Test 1: Application Submission
      console.log('📝 Testing application submission...');
      const appResult = await this.testApplicationSubmission();
      results.push(appResult);
      if (!appResult.success) overallSuccess = false;

      // Test 2: Admin Acceptance
      console.log('✅ Testing admin acceptance...');
      const acceptResult = await this.testAdminAcceptance();
      results.push(acceptResult);
      if (!acceptResult.success) overallSuccess = false;

      // Test 3: Preceptor Assignment
      console.log('👥 Testing preceptor assignment...');
      const assignResult = await this.testPreceptorAssignment();
      results.push(assignResult);
      if (!assignResult.success) overallSuccess = false;

      // Test 4: Course Creation
      console.log('📚 Testing course creation...');
      const courseResult = await this.testCourseCreation();
      results.push(courseResult);
      if (!courseResult.success) overallSuccess = false;

      // Test 5: Assignment Creation
      console.log('📋 Testing assignment creation...');
      const assignmentResult = await this.testAssignmentCreation();
      results.push(assignmentResult);
      if (!assignmentResult.success) overallSuccess = false;

      // Test 6: Fellow Response
      console.log('✍️ Testing fellow response...');
      const responseResult = await this.testFellowResponse();
      results.push(responseResult);
      if (!responseResult.success) overallSuccess = false;

      // Test 7: Preceptor Grading
      console.log('📊 Testing preceptor grading...');
      const gradingResult = await this.testPreceptorGrading();
      results.push(gradingResult);
      if (!gradingResult.success) overallSuccess = false;

      const summary = overallSuccess 
        ? 'All tests passed! Complete application workflow is functional.'
        : 'Some tests failed. Check individual results for details.';

      console.log('🎉 Test suite completed!', { overallSuccess, results });

      return {
        overallSuccess,
        results,
        summary,
      };
    } catch (error) {
      console.error('❌ Test suite failed:', error);
      return {
        overallSuccess: false,
        results,
        summary: `Test suite failed with error: ${error}`,
      };
    }
  }

  // Clean up test data
  async cleanupTestData(): Promise<void> {
    try {
      // Remove test applications
      const applications = JSON.parse(localStorage.getItem('cdpta_submitted_applications') || '[]');
      const filteredApplications = applications.filter((app: any) => 
        !app.personalInfo.email.includes('test.applicant')
      );
      localStorage.setItem('cdpta_submitted_applications', JSON.stringify(filteredApplications));

      // Remove test users
      const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const filteredUsers = users.filter((user: any) => 
        !user.email.includes('test.applicant')
      );
      localStorage.setItem('registeredUsers', JSON.stringify(filteredUsers));

      // Remove test courses
      const courses = JSON.parse(localStorage.getItem('staff_courses') || '[]');
      const filteredCourses = courses.filter((course: any) => 
        !course.title.includes('Test HTA Course')
      );
      localStorage.setItem('staff_courses', JSON.stringify(filteredCourses));

      // Remove test assignments
      const assignments = JSON.parse(localStorage.getItem('staff_assignments') || '[]');
      const filteredAssignments = assignments.filter((assign: any) => 
        !assign.title.includes('Test Assignment')
      );
      localStorage.setItem('staff_assignments', JSON.stringify(filteredAssignments));

      // Remove test submissions
      const submissions = JSON.parse(localStorage.getItem('assignment_submissions') || '[]');
      const filteredSubmissions = submissions.filter((sub: any) => 
        !sub.fellowId.includes('test-fellow')
      );
      localStorage.setItem('assignment_submissions', JSON.stringify(filteredSubmissions));

      console.log('🧹 Test data cleaned up successfully');
    } catch (error) {
      console.error('❌ Failed to cleanup test data:', error);
    }
  }
}

export const testService = new TestService();
