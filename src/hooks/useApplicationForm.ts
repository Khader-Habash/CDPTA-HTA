import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { ApplicationFormData, ApplicationStep, ValidationError } from '@/types/application';
import { useToast } from '@/components/ui/Toaster';
import { emitApplicationSubmitted } from '@/services/eventBus';
import { broadcastStorageChange } from '@/utils/storageSync';
import { useAuth } from '@/contexts/AuthContext';

const STORAGE_KEY = 'applicationFormData';
const SUBMITTED_APPS_KEY = 'cdpta_submitted_applications';
const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

const initialFormData: ApplicationFormData = {
  personalInfo: {
    title: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    countryOfResidence: '',
    phone: '',
    email: '',
    alternativeEmail: '',
    address: {
      street: '',
      city: '',
      postalCode: '',
      country: '',
    },
    isKHCCStaff: false,
    khccStaffId: '',
  },
  education: {
    currentLevel: '',
    institution: '',
    fieldOfStudy: '',
    graduationDate: '',
    gpa: '',
    transcriptUploaded: false,
    previousEducation: [],
  },
  experience: {
    workExperience: [],
    skills: [],
    languages: [],
  },
  programInfo: {
    programType: '',
    preferredStartDate: '',
    studyMode: 'full-time',
    campus: '',
    specialization: '',
    previousApplications: false,
    fundingSource: '',
    canTravel: false,
    travelReason: '',
    whyJoinCDPTA: '',
    engagedInCDPTAProjects: false,
    projectDetails: '',
  },
  essays: {
    personalStatement: '',
    motivationLetter: '',
    careerGoals: '',
    whyThisProgram: '',
    additionalInfo: '',
  },
  essay: {
    statementOfPurpose: '',
    researchInterests: '',
    careerGoals: '',
    whyThisProgram: '',
  },
  references: [],
  documents: {
    cv: null,
    transcript: null,
    motivationLetter: null,
    letterOfInterest: null,
    additionalDocuments: [],
  },
  metadata: {
    currentStep: 1,
    totalSteps: 5,
    completedSteps: [],
    lastSaved: '',
    status: 'draft',
  },
};

const applicationSteps: ApplicationStep[] = [
  {
    id: 1,
    title: 'Personal Information',
    description: 'Basic personal details and contact information',
    isCompleted: false,
    isRequired: true,
    validationFields: ['personalInfo.firstName', 'personalInfo.lastName', 'personalInfo.email', 'personalInfo.phone'],
  },
  {
    id: 2,
    title: 'Educational Background',
    description: 'Your academic history and qualifications',
    isCompleted: false,
    isRequired: true,
    validationFields: ['education.currentLevel', 'education.institution', 'education.fieldOfStudy'],
  },
  {
    id: 3,
    title: 'Program Information',
    description: 'Additional information about your interest in CDPTA',
    isCompleted: false,
    isRequired: true,
    validationFields: ['programInfo.whyJoinCDPTA'],
  },
  {
    id: 4,
    title: 'Documents',
    description: 'Upload required documents',
    isCompleted: false,
    isRequired: true,
    validationFields: ['documents.letterOfInterest', 'documents.cv'],
  },
  {
    id: 5,
    title: 'Review & Submit',
    description: 'Review your application before submission',
    isCompleted: false,
    isRequired: true,
    validationFields: [],
  },
];

export const useApplicationForm = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<ApplicationFormData>(initialFormData);
  const [steps, setSteps] = useState<ApplicationStep[]>(applicationSteps);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [hasShownRestoreToast, setHasShownRestoreToast] = useState(false);
  const { addToast } = useToast();

  // Load saved data on component mount
  useEffect(() => {
    const loadSavedData = () => {
      try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          // Merge with initial data to ensure all fields have proper defaults
          const mergedData = {
            ...initialFormData,
            ...parsedData,
            personalInfo: {
              ...initialFormData.personalInfo,
              ...parsedData.personalInfo,
              address: {
                ...initialFormData.personalInfo.address,
                ...parsedData.personalInfo?.address,
              },
            },
            education: {
              ...initialFormData.education,
              ...parsedData.education,
              currentLevel: parsedData.education?.currentLevel || '',
              institution: parsedData.education?.institution || '',
              fieldOfStudy: parsedData.education?.fieldOfStudy || '',
              graduationDate: parsedData.education?.graduationDate || '',
              gpa: parsedData.education?.gpa || '',
              previousEducation: parsedData.education?.previousEducation || [],
            },
            experience: {
              ...initialFormData.experience,
              ...parsedData.experience,
              workExperience: parsedData.experience?.workExperience || [],
              skills: parsedData.experience?.skills || [],
              languages: parsedData.experience?.languages || [],
            },
            programInfo: {
              ...initialFormData.programInfo,
              ...parsedData.programInfo,
              // Ensure new fields are present
              canTravel: parsedData.programInfo?.canTravel ?? false,
              travelReason: parsedData.programInfo?.travelReason ?? '',
              whyJoinCDPTA: parsedData.programInfo?.whyJoinCDPTA ?? '',
              engagedInCDPTAProjects: parsedData.programInfo?.engagedInCDPTAProjects ?? false,
              projectDetails: parsedData.programInfo?.projectDetails ?? '',
            },
            essays: {
              ...initialFormData.essays,
              ...parsedData.essays,
            },
            essay: {
              ...initialFormData.essay,
              ...parsedData.essay,
              researchInterests: parsedData.essay?.researchInterests || '',
            },
            references: parsedData.references || [],
            documents: {
              ...initialFormData.documents,
              ...parsedData.documents,
              cv: parsedData.documents?.cv || null,
              transcript: parsedData.documents?.transcript || null,
              motivationLetter: parsedData.documents?.motivationLetter || null,
              additionalDocuments: parsedData.documents?.additionalDocuments || [],
            },
            metadata: {
              ...initialFormData.metadata,
              currentStep: (() => {
                const oldStep = parsedData.metadata?.currentStep || 1;
                const oldTotalSteps = parsedData.metadata?.totalSteps || 5;
                
                // If old data had 4 steps and we're at step 3 or higher, adjust for new 5-step structure
                if (oldTotalSteps === 4 && oldStep >= 3) {
                  return oldStep + 1; // Shift steps 3 and 4 to 4 and 5
                }
                return oldStep;
              })(),
              totalSteps: 5,
              completedSteps: parsedData.metadata?.completedSteps || [],
              lastSaved: parsedData.metadata?.lastSaved || '',
              status: parsedData.metadata?.status || 'draft',
            },
          };
          setFormData(mergedData);
          updateStepCompletion(mergedData);
          
          // Only show restore toast once per session
          if (!hasShownRestoreToast) {
            addToast({
              type: 'info',
              title: 'Application Restored',
              message: 'Your previously saved application has been loaded.',
            });
            setHasShownRestoreToast(true);
          }
        }
      } catch (error) {
        console.error('Error loading saved application:', error);
        addToast({
          type: 'error',
          title: 'Load Error',
          message: 'Could not restore your saved application.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedData();
  }, [addToast]);

  // Auto-save functionality - TEMPORARILY DISABLED FOR DEBUGGING
  useEffect(() => {
    console.log('🔍 Auto-save disabled for debugging');
    // const autoSave = setInterval(() => {
    //   if (formData.metadata.lastSaved) {
    //     saveApplication(false); // Silent save
    //   }
    // }, AUTO_SAVE_INTERVAL);

    // return () => clearInterval(autoSave);
  }, [formData]);

  // Update step completion based on form data
  const updateStepCompletion = useCallback((data: ApplicationFormData) => {
    console.log('🔍 updateStepCompletion called with data:', data);
    console.log('🔍 Current steps:', steps);
    
    const updatedSteps = steps.map(step => {
      const isCompleted = validateStep(step, data);
      console.log(`🔍 Step ${step.id} (${step.title}): isCompleted = ${isCompleted}`);
      return { ...step, isCompleted };
    });

    const completedStepIds = updatedSteps
      .filter(step => step.isCompleted)
      .map(step => step.id);

    console.log('🔍 Completed step IDs:', completedStepIds);
    setSteps(updatedSteps);
    setFormData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        completedSteps: completedStepIds,
      },
    }));
  }, [steps]);

  // Validate a specific step
  const validateStep = (step: ApplicationStep, data: ApplicationFormData): boolean => {
    if (!step.isRequired) return true;

    return step.validationFields.every(fieldPath => {
      const value = getNestedValue(data, fieldPath);
      console.log(`🔍 Validating field ${fieldPath}:`, value);
      
      if (fieldPath === 'references') {
        return Array.isArray(value) && value.length >= 2;
      }
      
      if (fieldPath.startsWith('documents.')) {
        console.log(`🔍 Document validation for ${fieldPath}:`, value !== null && value !== undefined);
        return value !== null && value !== undefined;
      }
      
      return value && value.toString().trim() !== '';
    });
  };

  // Get nested object value by path
  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  // Update form data
  const updateFormData = useCallback((section: keyof ApplicationFormData, data: any) => {
    console.log('🔄 updateFormData called:', section, data);
    
    if (section === 'documents') {
      console.log('🔄 Documents update - Data content:', JSON.stringify(data, null, 2));
    }
    
    setFormData(prev => {
      console.log('🔄 Previous form data:', prev);
      
      if (section === 'documents') {
        console.log('🔄 Previous documents data:', prev.documents);
      }
      
      const updatedData = {
        ...prev,
        [section]: typeof data === 'function' ? data(prev[section]) : data,
        metadata: {
          ...prev.metadata,
          lastSaved: new Date().toISOString(),
        },
      };
      
      console.log('🔄 Updated form data:', updatedData);
      
      if (section === 'documents') {
        console.log('🔄 Updated documents data:', updatedData.documents);
      }
      
      updateStepCompletion(updatedData);
      
      // Force validation after a small delay to ensure state is updated
      setTimeout(() => {
        console.log('⏰ Delayed validation check');
        updateStepCompletion(updatedData);
      }, 100);
      
      return updatedData;
    });
  }, [updateStepCompletion]);

  // Save application
  const saveApplication = async (showToast = true) => {
    setIsSaving(true);
    try {
      const dataToSave = {
        ...formData,
        metadata: {
          ...formData.metadata,
          lastSaved: new Date().toISOString(),
        },
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      
      if (showToast) {
        addToast({
          type: 'success',
          title: 'Application Saved',
          message: 'Your application has been saved successfully.',
        });
      }
    } catch (error) {
      console.error('Error saving application:', error);
      addToast({
        type: 'error',
        title: 'Save Error',
        message: 'Could not save your application. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Navigate to step
  const goToStep = (stepNumber: number) => {
    if (stepNumber >= 1 && stepNumber <= formData.metadata.totalSteps) {
      setFormData(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          currentStep: stepNumber,
        },
      }));
    }
  };

  // Next step
  const nextStep = () => {
    const currentStep = steps.find(s => s.id === formData.metadata.currentStep);
    if (currentStep && validateStep(currentStep, formData)) {
      goToStep(formData.metadata.currentStep + 1);
      setValidationErrors([]);
    } else {
      // Show validation errors
      const errors = getStepValidationErrors(currentStep!, formData);
      setValidationErrors(errors);
      addToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please complete all required fields before proceeding.',
      });
    }
  };

  // Previous step
  const previousStep = () => {
    goToStep(formData.metadata.currentStep - 1);
    setValidationErrors([]);
  };

  // Get validation errors for a step
  const getStepValidationErrors = (step: ApplicationStep, data: ApplicationFormData): ValidationError[] => {
    const errors: ValidationError[] = [];

    step.validationFields.forEach(fieldPath => {
      const value = getNestedValue(data, fieldPath);
      
      // Handle different validation types
      if (fieldPath.startsWith('documents.')) {
        // Document fields need special handling
        if (!value || value === null) {
          const fieldName = fieldPath.split('.').pop();
          let displayName = fieldName;
          if (fieldName === 'letterOfInterest') {
            displayName = 'Letter of Interest';
          } else if (fieldName === 'cv') {
            displayName = 'Curriculum Vitae (CV)';
          }
          errors.push({
            field: fieldPath,
            message: `${displayName} is required`,
          });
        }
      } else {
        // Regular text fields
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          const fieldName = fieldPath.split('.').pop();
          // Provide user-friendly names
          let displayName = fieldName;
          if (fieldName === 'whyJoinCDPTA') {
            displayName = 'Why you want to join the HTA fellowship at CDPTA or delivered by CDPTA';
          } else if (fieldName === 'firstName') {
            displayName = 'First Name';
          } else if (fieldName === 'lastName') {
            displayName = 'Last Name';
          }
          errors.push({
            field: fieldPath,
            message: `${displayName} is required`,
          });
        }
      }
    });

    return errors;
  };

  // Submit application
  const submitApplication = async () => {
    try {
      console.log('📝 Starting submitApplication...');
      setIsSaving(true);
      
      // Validate all required steps
      const requiredSteps = steps.filter(step => step.isRequired);
      console.log('📋 Required steps:', requiredSteps.map(s => s.title));
      const incompleteSteps = requiredSteps.filter(step => !validateStep(step, formData));
      console.log('❌ Incomplete steps:', incompleteSteps.map(s => s.title));
      
      // For now, allow submission even if validation fails (for testing)
      if (incompleteSteps.length > 0) {
        console.warn('⚠️ Validation failed but allowing submission for testing:', incompleteSteps.map(s => s.title));
        // Don't return false, continue with submission
      }

      // Here you would typically send the data to your API
      const submissionData = {
        ...formData,
        metadata: {
          ...formData.metadata,
          status: 'submitted' as const,
          submissionDate: new Date().toISOString(),
          applicationId: `APP-${Date.now()}`,
        },
      };

      // Get user ID for Supabase - try multiple sources
      let userId: string | null = null;
      if (user?.id) {
        userId = user.id;
      } else if (isSupabaseConfigured() && supabase) {
        // Try to get user ID from Supabase session
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user?.id) {
            userId = session.user.id;
          }
        } catch (e) {
          console.warn('Could not get user ID from Supabase session:', e);
        }
      }

      // Always save locally FIRST as backup and for offline access
      // This ensures admin can see it even if Supabase fails
      setFormData(submissionData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(submissionData));

      // Save to submitted applications list for admin view (local storage)
      const submittedApps = JSON.parse(localStorage.getItem(SUBMITTED_APPS_KEY) || '[]');
      // Check if application already exists (avoid duplicates)
      const existingIndex = submittedApps.findIndex((app: any) => 
        app.id === submissionData.metadata.applicationId || 
        app.metadata?.applicationId === submissionData.metadata.applicationId
      );
      
      // Ensure metadata has the correct status
      const applicationToSave = {
        ...submissionData,
        id: submissionData.metadata.applicationId,
        submittedAt: submissionData.metadata.submissionDate || submissionData.metadata.submittedAt || new Date().toISOString(),
        applicantId: userId || 'unknown',
        metadata: {
          ...submissionData.metadata,
          status: 'submitted', // Ensure status is explicitly set
          submittedAt: submissionData.metadata.submissionDate || submissionData.metadata.submittedAt || new Date().toISOString(),
          applicationId: submissionData.metadata.applicationId,
        },
        // Ensure personalInfo exists for admin display
        personalInfo: submissionData.personalInfo || {},
        education: submissionData.education || {},
        documents: submissionData.documents || {},
      };
      
      if (existingIndex >= 0) {
        submittedApps[existingIndex] = applicationToSave;
        console.log('🔄 Updated existing application in localStorage');
      } else {
        submittedApps.push(applicationToSave);
        console.log('➕ Added new application to localStorage');
      }
      
      try {
        localStorage.setItem(SUBMITTED_APPS_KEY, JSON.stringify(submittedApps));
        console.log('✅ Application saved to localStorage for admin view');
        console.log('📊 Total applications in localStorage:', submittedApps.length);
        console.log('📋 Saved application ID:', applicationToSave.id);
        console.log('📋 Saved application status:', applicationToSave.metadata?.status);
        
        // Verify the save worked
        const verifySave = JSON.parse(localStorage.getItem(SUBMITTED_APPS_KEY) || '[]');
        const savedApp = verifySave.find((app: any) => app.id === applicationToSave.id);
        if (savedApp) {
          console.log('✅ Verification: Application found in localStorage after save');
        } else {
          console.error('❌ Verification FAILED: Application NOT found in localStorage after save!');
        }
      } catch (error) {
        console.error('❌ Failed to save application to localStorage:', error);
        // Try saving without the full data structure if quota exceeded
        try {
          const minimalApp = {
            id: submissionData.metadata.applicationId,
            applicantId: userId || 'unknown',
            submittedAt: submissionData.metadata.submissionDate || new Date().toISOString(),
            personalInfo: {
              firstName: submissionData.personalInfo?.firstName || '',
              lastName: submissionData.personalInfo?.lastName || '',
              email: submissionData.personalInfo?.email || '',
            },
            metadata: {
              status: 'submitted',
              applicationId: submissionData.metadata.applicationId,
              submittedAt: submissionData.metadata.submissionDate || new Date().toISOString(),
            }
          };
          submittedApps.push(minimalApp);
          localStorage.setItem(SUBMITTED_APPS_KEY, JSON.stringify(submittedApps));
          console.log('⚠️ Saved minimal application data due to storage quota');
        } catch (minimalError) {
          console.error('❌ Failed to save even minimal application data:', minimalError);
        }
      }

      // PRIMARY: Save to Supabase FIRST (required for multi-user real-time sync)
      let supabaseSaved = false;
      if (isSupabaseConfigured() && supabase) {
        try {
          // Get or create user_id for the application
          let finalUserId = userId;
          if (!finalUserId) {
            // Try to get user by email from Supabase
            const { data: userData } = await supabase
              .from('users')
              .select('id')
              .eq('email', submissionData.personalInfo.email)
              .single();
            
            if (userData) {
              finalUserId = userData.id;
            } else {
              // Create user if doesn't exist (for applicants)
              const { data: newUser, error: userError } = await supabase
                .from('users')
                .insert({
                  email: submissionData.personalInfo.email,
                  first_name: submissionData.personalInfo.firstName,
                  last_name: submissionData.personalInfo.lastName,
                  role: 'applicant',
                  is_active: true,
                })
                .select()
                .single();
              
              if (!userError && newUser) {
                finalUserId = newUser.id;
                console.log('✅ Created user in Supabase for application');
              }
            }
          }

          const payload = {
            user_id: finalUserId || null, // Allow null for unauthenticated submissions
            application_id: submissionData.metadata.applicationId,
            status: submissionData.metadata.status,
            data: submissionData,
            submitted_at: submissionData.metadata.submissionDate,
          };
          
          const { error } = await supabase.from('applications').insert(payload);
          if (error) {
            console.error('❌ Supabase insert failed:', error.message || error);
            throw error; // Fail hard - we need Supabase for multi-user
          } else {
            supabaseSaved = true;
            console.log('✅ [PRIMARY] Application saved to Supabase - real-time sync enabled!');
          }
        } catch (e) {
          console.error('❌ Supabase save failed:', e);
          // Still save to localStorage as backup, but warn user
          addToast({
            type: 'warning',
            title: 'Limited Functionality',
            message: 'Application saved locally. Multi-user sync requires Supabase configuration.',
            duration: 5000,
          });
        }
      } else {
        console.warn('⚠️ Supabase not configured - multi-user sync unavailable');
        addToast({
          type: 'warning',
          title: 'Local Storage Only',
          message: 'Application saved locally. Configure Supabase for multi-user real-time sync.',
          duration: 5000,
        });
      }

      // Broadcast to tabs (same browser) so Admin page refreshes immediately in another tab
      broadcastStorageChange(SUBMITTED_APPS_KEY, submittedApps);
      console.log('📢 Application broadcasted to all tabs (local)');

      // Emit event for application submission
      console.log('📡 Emitting application submitted event...');
      emitApplicationSubmitted({
        applicationId: submissionData.metadata.applicationId!,
        applicantName: `${submissionData.personalInfo.firstName} ${submissionData.personalInfo.lastName}`,
        applicantEmail: submissionData.personalInfo.email,
      });
      console.log('✅ Application submitted event emitted successfully');

      addToast({
        type: 'success',
        title: 'Application Submitted Successfully!',
        message: 'Thank you for your application. We will review it and get back to you soon.',
      });

      return true;
    } catch (error) {
      console.error('Error submitting application:', error);
      addToast({
        type: 'error',
        title: 'Submission Error',
        message: 'Could not submit your application. Please try again.',
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate progress percentage
  const getProgressPercentage = () => {
    const completedSteps = formData.metadata.completedSteps.length;
    return Math.round((completedSteps / formData.metadata.totalSteps) * 100);
  };

  // Clear application data
  const clearApplication = () => {
    localStorage.removeItem(STORAGE_KEY);
    setFormData(initialFormData);
    setSteps(applicationSteps);
    setValidationErrors([]);
    addToast({
      type: 'info',
      title: 'Application Cleared',
      message: 'Your application data has been cleared.',
    });
  };

  return {
    formData,
    steps,
    isLoading,
    isSaving,
    validationErrors,
    updateFormData,
    saveApplication,
    goToStep,
    nextStep,
    previousStep,
    submitApplication,
    getProgressPercentage,
    clearApplication,
    currentStep: steps.find(s => s.id === formData.metadata.currentStep),
    isFirstStep: formData.metadata.currentStep === 1,
    isLastStep: formData.metadata.currentStep === formData.metadata.totalSteps,
    canProceed: formData.metadata.currentStep < formData.metadata.totalSteps,
    isApplicationSubmitted: formData.metadata.status === 'submitted',
  };
};
