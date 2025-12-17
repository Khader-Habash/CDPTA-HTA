import React, { useState } from 'react';
import { ProgramInfo, FacultyMember, CurriculumModule, StudentResource } from '@/types/application';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  BookOpen, 
  Clock, 
  Users, 
  Award,
  Download,
  ExternalLink,
  Play,
  FileText,
  Calendar,
  GraduationCap,
  MapPin,
  Mail,
  Star
} from 'lucide-react';

const ProgramInfoPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'faculty' | 'resources'>('overview');

  // Mock program data - in real app this would come from API
  const programInfo: ProgramInfo = {
    id: 'cdpta-fellowship-2024',
    title: 'CDPTA Fellowship Program 2024',
    description: 'An intensive 12-month fellowship program focusing on drug policy research and technology assessment methodologies.',
    duration: '12 months',
    startDate: '2024-09-01',
    applicationDeadline: '2024-03-15',
    isApplicationOpen: true,
    requirements: [
      'Bachelor\'s degree in relevant field (Medicine, Pharmacy, Public Health, etc.)',
      'Minimum 2 years of relevant experience',
      'Proficiency in English (written and spoken)',
      'Research experience preferred',
      'Commitment to full-time participation'
    ],
    benefits: [
      'Monthly stipend of $3,000',
      'Health insurance coverage',
      'Conference attendance funding',
      'Access to KHCC research facilities',
      'Mentorship from leading experts',
      'Certificate of completion'
    ],
    curriculum: [
      {
        id: 'mod1',
        title: 'Introduction to Drug Policy Research',
        description: 'Foundations of drug policy, regulatory frameworks, and research methodologies.',
        duration: '4 weeks',
        credits: 6,
        objectives: [
          'Understand global drug policy landscape',
          'Learn research design principles',
          'Master data collection techniques'
        ]
      },
      {
        id: 'mod2',
        title: 'Technology Assessment in Healthcare',
        description: 'Health technology assessment, economic evaluation, and decision-making frameworks.',
        duration: '6 weeks',
        credits: 8,
        prerequisites: ['Introduction to Drug Policy Research'],
        objectives: [
          'Apply HTA methodologies',
          'Conduct economic evaluations',
          'Understand regulatory pathways'
        ]
      },
      {
        id: 'mod3',
        title: 'Data Analysis and Biostatistics',
        description: 'Statistical methods for drug policy research and technology assessment.',
        duration: '4 weeks',
        credits: 6,
        objectives: [
          'Master statistical software',
          'Perform advanced analyses',
          'Interpret research findings'
        ]
      },
      {
        id: 'mod4',
        title: 'Research Project',
        description: 'Independent research project under faculty supervision.',
        duration: '16 weeks',
        credits: 12,
        objectives: [
          'Design original research',
          'Collect and analyze data',
          'Present findings professionally'
        ]
      }
    ],
    faculty: [
      {
        id: 'dr-ahmad',
        name: 'Dr. Ahmad Al-Mansouri',
        title: 'Program Director',
        department: 'Drug Policy Research',
        specialization: ['Health Economics', 'Policy Analysis', 'Regulatory Science'],
        bio: 'Dr. Al-Mansouri has over 15 years of experience in drug policy research and health technology assessment. He has published over 50 peer-reviewed articles and serves on multiple international advisory boards.',
        email: 'a.mansouri@khcc.jo',
        researchInterests: ['Drug pricing policies', 'Access to medicines', 'Regulatory frameworks'],
        publications: [
          'The Impact of Drug Pricing Policies in Middle East (2023)',
          'Technology Assessment Frameworks for Emerging Markets (2022)'
        ]
      },
      {
        id: 'dr-sara',
        name: 'Dr. Sara Khalil',
        title: 'Senior Research Fellow',
        department: 'Biostatistics',
        specialization: ['Biostatistics', 'Epidemiology', 'Data Science'],
        bio: 'Dr. Khalil specializes in advanced statistical methods for health research. She leads the data analysis core and has extensive experience in pharmaceutical research.',
        email: 's.khalil@khcc.jo',
        researchInterests: ['Real-world evidence', 'Machine learning in healthcare', 'Clinical trial design'],
        publications: [
          'Machine Learning Applications in Drug Safety (2023)',
          'Real-World Evidence Generation Methods (2022)'
        ]
      },
      {
        id: 'dr-omar',
        name: 'Dr. Omar Rashid',
        title: 'Clinical Research Director',
        department: 'Clinical Research',
        specialization: ['Clinical Trials', 'Oncology', 'Regulatory Affairs'],
        bio: 'Dr. Rashid brings extensive clinical research experience from both academic and industry settings. He has led multiple international clinical trials.',
        email: 'o.rashid@khcc.jo',
        researchInterests: ['Oncology drug development', 'Clinical trial methodology', 'Regulatory pathways'],
        publications: [
          'Clinical Trial Design in Oncology (2023)',
          'Regulatory Considerations for Cancer Therapeutics (2022)'
        ]
      }
    ],
    studentResources: [
      {
        id: 'handbook',
        title: 'Fellowship Handbook',
        description: 'Comprehensive guide covering all aspects of the fellowship program.',
        type: 'document',
        downloadUrl: '/resources/fellowship-handbook.pdf',
        category: 'academic'
      },
      {
        id: 'library',
        title: 'KHCC Digital Library',
        description: 'Access to extensive collection of medical and research databases.',
        type: 'link',
        url: 'https://library.khcc.jo',
        category: 'research'
      },
      {
        id: 'statistical-software',
        title: 'Statistical Software Training',
        description: 'Training materials for R, SAS, and SPSS.',
        type: 'video',
        url: '/training/statistics',
        category: 'academic'
      },
      {
        id: 'career-services',
        title: 'Career Development Services',
        description: 'Professional development workshops and career counseling.',
        type: 'link',
        url: '/services/career',
        category: 'career'
      }
    ]
  };

  const TabButton: React.FC<{ 
    tab: typeof activeTab; 
    label: string; 
    icon: React.ReactNode;
    isActive: boolean;
  }> = ({ tab, label, icon, isActive }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
        isActive 
          ? 'bg-primary-600 text-white' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{programInfo.title}</h1>
        <p className="text-gray-600 mt-2">{programInfo.description}</p>
      </div>

      {/* Program Status */}
      <div className="flex items-center space-x-4">
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          programInfo.isApplicationOpen 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {programInfo.isApplicationOpen ? 'Applications Open' : 'Applications Closed'}
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar size={16} />
          <span>Deadline: {new Date(programInfo.applicationDeadline).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock size={16} />
          <span>{programInfo.duration}</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 pb-4">
        <TabButton 
          tab="overview" 
          label="Overview" 
          icon={<BookOpen size={16} />}
          isActive={activeTab === 'overview'}
        />
        <TabButton 
          tab="curriculum" 
          label="Curriculum" 
          icon={<GraduationCap size={16} />}
          isActive={activeTab === 'curriculum'}
        />
        <TabButton 
          tab="faculty" 
          label="Faculty" 
          icon={<Users size={16} />}
          isActive={activeTab === 'faculty'}
        />
        <TabButton 
          tab="resources" 
          label="Resources" 
          icon={<FileText size={16} />}
          isActive={activeTab === 'resources'}
        />
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold">Program Highlights</h3>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Clock className="text-primary-600" size={20} />
                  <div>
                    <h4 className="font-medium">Duration</h4>
                    <p className="text-sm text-gray-600">{programInfo.duration} intensive program</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="text-blue-600" size={20} />
                  <div>
                    <h4 className="font-medium">Start Date</h4>
                    <p className="text-sm text-gray-600">{new Date(programInfo.startDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="text-green-600" size={20} />
                  <div>
                    <h4 className="font-medium">Location</h4>
                    <p className="text-sm text-gray-600">King Hussein Cancer Center, Amman</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="text-purple-600" size={20} />
                  <div>
                    <h4 className="font-medium">Certification</h4>
                    <p className="text-sm text-gray-600">CDPTA Fellowship Certificate</p>
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold">Requirements</h3>
            </Card.Header>
            <Card.Content>
              <ul className="space-y-2">
                {programInfo.requirements.map((req, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </Card.Content>
          </Card>

          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold">Program Benefits</h3>
            </Card.Header>
            <Card.Content>
              <ul className="space-y-2">
                {programInfo.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <Star className="text-yellow-500 mt-0.5 flex-shrink-0" size={16} />
                    <span className="text-sm text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </Card.Content>
          </Card>

          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold">Application Status</h3>
            </Card.Header>
            <Card.Content>
              <div className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  programInfo.isApplicationOpen 
                    ? 'bg-green-100' 
                    : 'bg-red-100'
                }`}>
                  <Calendar className={programInfo.isApplicationOpen ? 'text-green-600' : 'text-red-600'} size={24} />
                </div>
                <h4 className="font-medium mb-2">
                  {programInfo.isApplicationOpen ? 'Applications Open' : 'Applications Closed'}
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  Deadline: {new Date(programInfo.applicationDeadline).toLocaleDateString()}
                </p>
                {programInfo.isApplicationOpen && (
                  <Button fullWidth>
                    Apply Now
                  </Button>
                )}
              </div>
            </Card.Content>
          </Card>
        </div>
      )}

      {activeTab === 'curriculum' && (
        <div className="space-y-6">
          {programInfo.curriculum.map((module, index) => (
            <Card key={module.id}>
              <Card.Header>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{module.title}</h3>
                    <p className="text-gray-600">{module.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Module {index + 1}</div>
                    <div className="text-sm font-medium">{module.credits} Credits</div>
                  </div>
                </div>
              </Card.Header>
              <Card.Content>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Learning Objectives</h4>
                    <ul className="space-y-1">
                      {module.objectives.map((objective, objIndex) => (
                        <li key={objIndex} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center space-x-2">
                        <Clock size={16} className="text-gray-500" />
                        <span className="text-sm text-gray-600">{module.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Award size={16} className="text-gray-500" />
                        <span className="text-sm text-gray-600">{module.credits} credits</span>
                      </div>
                    </div>
                    {module.prerequisites && (
                      <div>
                        <h4 className="font-medium mb-2">Prerequisites</h4>
                        <ul className="space-y-1">
                          {module.prerequisites.map((prereq, preIndex) => (
                            <li key={preIndex} className="text-sm text-gray-600">
                              • {prereq}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'faculty' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {programInfo.faculty.map((faculty) => (
            <Card key={faculty.id}>
              <Card.Content className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="text-primary-600" size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{faculty.name}</h3>
                    <p className="text-primary-600 font-medium">{faculty.title}</p>
                    <p className="text-sm text-gray-600 mb-3">{faculty.department}</p>
                    
                    <div className="mb-3">
                      <h4 className="font-medium text-sm mb-1">Specialization</h4>
                      <div className="flex flex-wrap gap-1">
                        {faculty.specialization.map((spec, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-3">{faculty.bio}</p>
                    
                    <div className="mb-3">
                      <h4 className="font-medium text-sm mb-1">Research Interests</h4>
                      <ul className="text-xs text-gray-600">
                        {faculty.researchInterests.map((interest, index) => (
                          <li key={index}>• {interest}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Mail size={14} className="text-gray-500" />
                      <a href={`mailto:${faculty.email}`} className="text-sm text-primary-600 hover:underline">
                        {faculty.email}
                      </a>
                    </div>
                  </div>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'resources' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {programInfo.studentResources.map((resource) => {
            const getIcon = () => {
              switch (resource.type) {
                case 'document': return <FileText size={20} />;
                case 'video': return <Play size={20} />;
                case 'link': return <ExternalLink size={20} />;
                default: return <FileText size={20} />;
              }
            };

            const getCategoryColor = () => {
              switch (resource.category) {
                case 'academic': return 'bg-blue-100 text-blue-800';
                case 'research': return 'bg-green-100 text-green-800';
                case 'career': return 'bg-purple-100 text-purple-800';
                case 'support': return 'bg-yellow-100 text-yellow-800';
                default: return 'bg-gray-100 text-gray-800';
              }
            };

            return (
              <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                <Card.Content className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gray-100 rounded-lg flex-shrink-0">
                      {getIcon()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{resource.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor()}`}>
                          {resource.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          if (resource.url) window.open(resource.url, '_blank');
                          if (resource.downloadUrl) window.open(resource.downloadUrl, '_blank');
                        }}
                      >
                        {resource.type === 'document' ? (
                          <>
                            <Download size={14} className="mr-2" />
                            Download
                          </>
                        ) : (
                          <>
                            <ExternalLink size={14} className="mr-2" />
                            Open
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProgramInfoPage;

