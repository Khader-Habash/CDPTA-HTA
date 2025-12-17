import { ApplicationFormData } from '@/types/application';
import { apiClient } from './apiClient';

export interface ApplicationSubmissionData {
  applicationId: string;
  applicantName: string;
  applicantEmail: string;
  applicationData: ApplicationFormData;
}

export interface ApplicationSubmissionResponse {
  success: boolean;
  applicationId: string;
  message: string;
  submittedAt: string;
}

class ApplicationService {
  /**
   * Submit a fellowship application
   */
  async submitApplication(data: ApplicationSubmissionData): Promise<ApplicationSubmissionResponse> {
    try {
      console.log('📤 Submitting application to backend:', data.applicationId);
      
      // For now, simulate a successful submission since we don't have a real backend
      // In a real application, this would make an API call to the backend
      const response = await this.simulateSubmission(data);
      
      console.log('✅ Application submitted successfully:', response);
      return response;
      
    } catch (error) {
      console.error('❌ Failed to submit application:', error);
      throw new Error(`Failed to submit application: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Simulate application submission (replace with real API call)
   */
  private async simulateSubmission(data: ApplicationSubmissionData): Promise<ApplicationSubmissionResponse> {
    console.log('🔄 ApplicationService: Starting simulated submission...');
    console.log('🔄 ApplicationService: Application ID:', data.applicationId);
    console.log('🔄 ApplicationService: Applicant Name:', data.applicantName);
    console.log('🔄 ApplicationService: Application Data Keys:', Object.keys(data.applicationData));
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate occasional failures for testing
    if (Math.random() < 0.1) { // 10% failure rate for testing
      console.log('❌ ApplicationService: Simulated network error');
      throw new Error('Simulated network error');
    }
    
    const response = {
      success: true,
      applicationId: data.applicationId,
      message: 'Application submitted successfully',
      submittedAt: new Date().toISOString(),
    };
    
    console.log('✅ ApplicationService: Submission successful:', response);
    return response;
  }

  /**
   * Get application status by ID
   */
  async getApplicationStatus(applicationId: string): Promise<{
    status: 'pending' | 'under_review' | 'approved' | 'rejected';
    message: string;
    reviewedAt?: string;
  }> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        status: 'pending',
        message: 'Application is pending review',
      };
    } catch (error) {
      throw new Error(`Failed to get application status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get all applications (for admin/staff)
   */
  async getAllApplications(): Promise<ApplicationFormData[]> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return applications from localStorage for now
      const applications: ApplicationFormData[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('application_')) {
          try {
            const appData = JSON.parse(localStorage.getItem(key)!);
            if (appData && appData.metadata && appData.metadata.status === 'submitted') {
              applications.push(appData);
            }
          } catch (error) {
            console.error('Error parsing application data:', error);
          }
        }
      }
      
      console.log('📋 ApplicationService: Retrieved applications:', applications.length);
      return applications;
    } catch (error) {
      throw new Error(`Failed to get applications: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const applicationService = new ApplicationService();
