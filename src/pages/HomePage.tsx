import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { Announcement } from '@/types/announcement';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { announcementService } from '@/services/announcementService';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  Award,
  FileText,
  Calendar,
  Bell,
  Activity,
  HelpCircle,
  AlertCircle,
  Brain,
  Search,
  Wrench,
  Megaphone
} from 'lucide-react';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  // Load announcements from Supabase on mount
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const data = await announcementService.getAnnouncements();
        console.log('🏠 HomePage: Fetched announcements from Supabase:', data);
        setAnnouncements(data.slice(0, 3)); // Top 3
      } catch (error) {
        console.error('❌ HomePage: Failed to load announcements:', error);
        setAnnouncements([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const getWelcomeMessage = () => {
    const timeOfDay = new Date().getHours() < 12 ? 'Good morning' : 
                     new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening';
    return `${timeOfDay}, ${user?.firstName}!`;
  };

  // Featured Services for CDPTA
  const featuredServices = [
    {
      title: "Drug Policy Research Methods",
      description: "Comprehensive guides and resources for conducting drug policy research, including methodology, data analysis, and best practices.",
      category: "Research",
      image: "/api/placeholder/300/200"
    },
    {
      title: "Technology Assessment Tools", 
      description: "Access cutting-edge tools and frameworks for technology assessment in healthcare and drug policy evaluation.",
      category: "Technology",
      image: "/api/placeholder/300/200"
    }
  ];

  const helpTopics = [
    {
      icon: <FileText className="text-blue-600" size={20} />,
      title: "New Fellow Orientation: CDPTA Research Methods",
      isNew: true
    },
    {
      icon: <AlertCircle className="text-orange-600" size={20} />,
      title: "Research Protocol Submission & Review Process"
    },
    {
      icon: <FileText className="text-purple-600" size={20} />,
      title: "Assessments Overview: Revising, Submitting, Mental Health & More"
    },
    {
      icon: <Brain className="text-teal-600" size={20} />,
      title: "AI & Technology: Guidelines for AI Tools in Drug Policy Research"
    },
    {
      icon: <Search className="text-gray-600" size={20} />,
      title: "CDPTA Platform Help: System Access, Troubleshooting & Updates"
    }
  ];

  const getRoleSpecificContent = () => {
    switch (user?.role) {
      case UserRole.APPLICANT:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <Card.Header>
                <div className="flex items-center space-x-3">
                  <FileText className="text-primary-600" size={24} />
                  <h3 className="text-lg font-semibold">Application Status</h3>
                </div>
              </Card.Header>
              <Card.Content>
                <p className="text-gray-600 mb-4">
                  Track your application progress and view requirements.
                </p>
                <Link to="/applicant/status">
                  <Button variant="outline" fullWidth>View Status</Button>
                </Link>
              </Card.Content>
            </Card>

            <Card>
              <Card.Header>
                <div className="flex items-center space-x-3">
                  <FileText className="text-blue-600" size={24} />
                  <h3 className="text-lg font-semibold">Complete Application</h3>
                </div>
              </Card.Header>
              <Card.Content>
                <p className="text-gray-600 mb-4">
                  Fill out your application form and submit required documents.
                </p>
                <Link to="/applicant/application">
                  <Button fullWidth>Continue Application</Button>
                </Link>
              </Card.Content>
            </Card>

            <Card>
              <Card.Header>
                <div className="flex items-center space-x-3">
                  <Calendar className="text-green-600" size={24} />
                  <h3 className="text-lg font-semibold">Important Dates</h3>
                </div>
              </Card.Header>
              <Card.Content>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Application Deadline: March 15, 2024</li>
                  <li>• Interview Period: April 1-15, 2024</li>
                  <li>• Decision Notification: May 1, 2024</li>
                </ul>
              </Card.Content>
            </Card>
          </div>
        );

      case UserRole.FELLOW:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <Card.Header>
                <div className="flex items-center space-x-3">
                  <BookOpen className="text-primary-600" size={24} />
                  <h3 className="text-lg font-semibold">My Courses</h3>
                </div>
              </Card.Header>
              <Card.Content>
                <p className="text-gray-600 mb-4">
                  Access your enrolled courses and learning materials.
                </p>
                <Link to="/fellow/courses">
                  <Button fullWidth>View Courses</Button>
                </Link>
              </Card.Content>
            </Card>

            <Card>
              <Card.Header>
                <div className="flex items-center space-x-3">
                  <Award className="text-yellow-600" size={24} />
                  <h3 className="text-lg font-semibold">My Projects</h3>
                </div>
              </Card.Header>
              <Card.Content>
                <p className="text-gray-600 mb-4">
                  Manage your fellowship projects and milestones.
                </p>
                <Link to="/fellow/projects">
                  <Button variant="outline" fullWidth>View Projects</Button>
                </Link>
              </Card.Content>
            </Card>

            <Card>
              <Card.Header>
                <div className="flex items-center space-x-3">
                  <TrendingUp className="text-green-600" size={24} />
                  <h3 className="text-lg font-semibold">Progress</h3>
                </div>
              </Card.Header>
              <Card.Content>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Course Completion</span>
                    <span>75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </div>
        );

      case UserRole.PRECEPTOR:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <Card.Header>
                <div className="flex items-center space-x-3">
                  <Users className="text-primary-600" size={24} />
                  <h3 className="text-lg font-semibold">Manage Fellows</h3>
                </div>
              </Card.Header>
              <Card.Content>
                <p className="text-gray-600 mb-4">
                  Monitor fellow progress and provide mentorship.
                </p>
                <Link to="/preceptor/fellows">
                  <Button fullWidth>View Fellows</Button>
                </Link>
              </Card.Content>
            </Card>

            <Card>
              <Card.Header>
                <div className="flex items-center space-x-3">
                  <BookOpen className="text-blue-600" size={24} />
                  <h3 className="text-lg font-semibold">Course Management</h3>
                </div>
              </Card.Header>
              <Card.Content>
                <p className="text-gray-600 mb-4">
                  Create and manage educational content and curricula.
                </p>
                <Link to="/preceptor/courses">
                  <Button variant="outline" fullWidth>Manage Courses</Button>
                </Link>
              </Card.Content>
            </Card>

            <Card>
              <Card.Header>
                <div className="flex items-center space-x-3">
                  <Activity className="text-green-600" size={24} />
                  <h3 className="text-lg font-semibold">Recent Activity</h3>
                </div>
              </Card.Header>
              <Card.Content>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 5 new applications submitted</li>
                  <li>• 3 fellows completed Module 2</li>
                  <li>• 2 projects require review</li>
                </ul>
              </Card.Content>
            </Card>
          </div>
        );

      case UserRole.ADMIN:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">1,247</p>
                  </div>
                  <Users className="text-primary-600" size={24} />
                </div>
              </Card.Content>
            </Card>

            <Card>
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Fellows</p>
                    <p className="text-2xl font-bold text-gray-900">89</p>
                  </div>
                  <Award className="text-yellow-600" size={24} />
                </div>
              </Card.Content>
            </Card>

            <Card>
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Applications</p>
                    <p className="text-2xl font-bold text-gray-900">156</p>
                  </div>
                  <FileText className="text-blue-600" size={24} />
                </div>
              </Card.Content>
            </Card>

            <Card>
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                    <p className="text-2xl font-bold text-gray-900">92%</p>
                  </div>
                  <TrendingUp className="text-green-600" size={24} />
                </div>
              </Card.Content>
            </Card>

            <div className="col-span-1 md:col-span-2 lg:col-span-4">
              <Card>
                <Card.Header>
                  <h3 className="text-lg font-semibold">Quick Actions</h3>
                </Card.Header>
                <Card.Content>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link to="/admin/users">
                      <Button variant="outline" fullWidth>Manage Users</Button>
                    </Link>
                    <Link to="/admin/analytics">
                      <Button variant="outline" fullWidth>View Analytics</Button>
                    </Link>
                    <Link to="/admin/settings">
                      <Button variant="outline" fullWidth>System Settings</Button>
                    </Link>
                  </div>
                </Card.Content>
              </Card>
            </div>
          </div>
        );

      default:
        return <div>Welcome to the Center for Drug Policy & Technology Assessment!</div>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-2">{getWelcomeMessage()}</h1>
        <p className="text-primary-100">Welcome to the Center for Drug Policy & Technology Assessment</p>
      </div>

      {/* Announcements Section - Fresh Implementation */}
      {!loading && announcements.length > 0 && (
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Megaphone className="text-primary-600" size={28} />
                <h2 className="text-2xl font-bold text-gray-900">Latest Announcements</h2>
              </div>
              <Link to="/announcements">
                <Button variant="outline" size="sm">
                  View All →
                </Button>
              </Link>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div 
                  key={announcement.id}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-primary-300 transition-colors"
                >
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    {announcement.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {announcement.content}
                  </p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                    <span>By {announcement.authorName}</span>
                    <span>•</span>
                    <span>{new Date(announcement.date).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Featured Services */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {featuredServices.map((service, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <Card.Content>
                <div className="flex space-x-4">
                  <div className="w-24 h-24 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="text-primary-600" size={32} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                    <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                      {service.category}
                    </span>
                    <div className="mt-3">
                      <Button size="sm">Try it out</Button>
                    </div>
                  </div>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      </div>

      {/* HELP Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">HELP: Trending Topics - Students</h2>
        <Card>
          <Card.Content>
            <div className="space-y-4">
              {helpTopics.map((topic, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                  <div className="flex-shrink-0">
                    {topic.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-gray-900 font-medium">{topic.title}</h4>
                      {topic.isNew && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                          NEW
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Department Information */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Department of Economics & Related Studies</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <Card.Content>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <BookOpen className="text-primary-600" size={20} />
                  <span className="text-gray-900">Economics Homepage</span>
                </div>
                <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <Users className="text-green-600" size={20} />
                  <span className="text-gray-900">Economics: Students</span>
                </div>
                <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <FileText className="text-blue-600" size={20} />
                  <span className="text-gray-900">Library Subject Guide: Economics</span>
                </div>
                <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <Activity className="text-purple-600" size={20} />
                  <span className="text-gray-900">Economics at York Twitter</span>
                </div>
                <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <HelpCircle className="text-gray-600" size={20} />
                  <span className="text-gray-900">Accessibility Statement</span>
                </div>
              </div>
            </Card.Content>
          </Card>

          <div className="bg-primary-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">HELP: Key Support for Students</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Calendar className="text-primary-600" size={16} />
                <span className="text-sm text-gray-700">Academic Calendar</span>
              </div>
              <div className="flex items-center space-x-3">
                <FileText className="text-primary-600" size={16} />
                <span className="text-sm text-gray-700">Assessment Guidelines</span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="text-primary-600" size={16} />
                <span className="text-sm text-gray-700">Student Support Services</span>
              </div>
              <div className="flex items-center space-x-3">
                <Wrench className="text-primary-600" size={16} />
                <span className="text-sm text-gray-700">Technical Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Role-specific quick actions */}
      {user?.role && (
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold">Quick Actions</h3>
          </Card.Header>
          <Card.Content>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/fellow/courses" className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-colors">
                <BookOpen className="text-blue-600" size={24} />
                <div>
                  <p className="font-medium text-gray-900">My Courses</p>
                  <p className="text-sm text-gray-600">View enrolled courses</p>
                </div>
              </Link>
              
              <Link to="/profile" className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-colors">
                <Users className="text-purple-600" size={24} />
                <div>
                  <p className="font-medium text-gray-900">My Profile</p>
                  <p className="text-sm text-gray-600">Update your information</p>
                </div>
              </Link>
              
              <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg hover:from-green-100 hover:to-green-200 transition-colors cursor-pointer">
                <Calendar className="text-green-600" size={24} />
                <div>
                  <p className="font-medium text-gray-900">Calendar</p>
                  <p className="text-sm text-gray-600">View upcoming events</p>
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>
      )}
    </div>
  );
};

export default HomePage;

              <div className="flex items-center space-x-3">
                <Wrench className="text-primary-600" size={16} />
                <span className="text-sm text-gray-700">Technical Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Role-specific quick actions */}
      {user?.role && (
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold">Quick Actions</h3>
          </Card.Header>
          <Card.Content>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/fellow/courses" className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-colors">
                <BookOpen className="text-blue-600" size={24} />
                <div>
                  <p className="font-medium text-gray-900">My Courses</p>
                  <p className="text-sm text-gray-600">View enrolled courses</p>
                </div>
              </Link>
              
              <Link to="/profile" className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-colors">
                <Users className="text-purple-600" size={24} />
                <div>
                  <p className="font-medium text-gray-900">My Profile</p>
                  <p className="text-sm text-gray-600">Update your information</p>
                </div>
              </Link>
              
              <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg hover:from-green-100 hover:to-green-200 transition-colors cursor-pointer">
                <Calendar className="text-green-600" size={24} />
                <div>
                  <p className="font-medium text-gray-900">Calendar</p>
                  <p className="text-sm text-gray-600">View upcoming events</p>
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>
      )}
    </div>
  );
};

export default HomePage;
