import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import AnnouncementCard from '@/components/AnnouncementCard';
import AnnouncementList from '@/components/AnnouncementList';
import { Announcement } from '@/types/announcement';
import { announcementService } from '@/services/announcementService';
import {
  GraduationCap,
  Users,
  BookOpen,
  Award,
  Calendar,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp,
  Globe,
  Shield,
  Lightbulb,
  Target,
  Heart,
  ChevronRight,
  ExternalLink,
  Clock,
  UserPlus,
  LogIn
} from 'lucide-react';

// NOTE: This page used to show hardcoded mock announcements.
// We now load real announcements from the service (Supabase) and
// render nothing if there are none.

const PublicLandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [publicAnnouncements, setPublicAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await announcementService.getAnnouncements();
        setPublicAnnouncements(data);
      } catch (e) {
        setPublicAnnouncements([]);
      }
    };
    load();
  }, []);

  const programFeatures = [
    {
      icon: BookOpen,
      title: 'HB-HTA Reports',
      description: 'Assessment of clinical effectiveness, safety, quality of life, and economic evidence',
    },
    {
      icon: Users,
      title: 'Drug Information Services',
      description: 'Comprehensive drug information and pharmacovigilance services',
    },
    {
      icon: Award,
      title: 'Economic Evaluation',
      description: 'Specialized economic evaluation assessments and Decision Analytical Modeling',
    },
    {
      icon: Globe,
      title: 'Regional Leadership',
      description: 'Pioneering regional center for health technology assessment',
    },
  ];

  const stats = [
    { number: '150+', label: 'Fellows Trained' },
    { number: '25+', label: 'Countries Represented' },
    { number: '95%', label: 'Career Advancement Rate' },
    { number: '50+', label: 'Research Publications' },
  ];


  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CDPTA</h1>
                <p className="text-sm text-gray-600">Center for Drug Policy & Technology Assessment</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button>Go to Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <Button className="flex items-center">
                      <LogIn size={16} className="mr-2" />
                      Sign In
                    </Button>
                  </Link>
              <Link to="/apply">
                <Button variant="outline" className="flex items-center">
                  <UserPlus size={16} className="mr-2" />
                  Apply for Fellowship
                </Button>
              </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Informed Decisions
              <span className="text-primary-600 block">Better Health Outcomes</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              The Center for Drug Policy and Technology Assessment (CDPTA) is a pioneering regional center providing 
              hospital-based health technology assessment (HB-HTA) services, drug information, and pharmacovigilance services. 
              We specialize in conducting economic evaluation assessments and Decision Analytical Modeling (DAM).
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/apply">
                <Button size="lg" className="flex items-center">
                  Apply for Fellowship
                  <ArrowRight size={20} className="ml-2" />
                </Button>
              </Link>
              {!isAuthenticated && (
                <Link to="/login">
                  <Button size="lg" variant="outline" className="flex items-center">
                    <LogIn size={20} className="mr-2" />
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              About CDPTA
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Health Technology Assessment (HTA) is a "multidisciplinary process that uses explicit methods to determine 
              the value of health technology at different points in its lifecycle. It aims to inform decision-making and 
              promote an equitable, efficient, high-quality health system."
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">CDPTA Mission</h3>
              <p className="text-gray-600 mb-6">
                To improve a rational selection and use of health technologies through applying HTA to generate 
                evidence-based information to policymakers, health care providers, and patients, and maintain 
                HTA capacity building within the Center.
              </p>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-6">CDPTA Vision</h3>
              <p className="text-gray-600 mb-6">
                To become a leading regional center providing HTA and drug information services recommendations 
                to improve health outcomes.
              </p>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-6">CDPTA Core Values</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Shield className="text-primary-600 mt-1 mr-3" size={20} />
                  <div>
                    <h4 className="font-semibold text-gray-900">Integrity</h4>
                    <p className="text-gray-600">Maintaining the highest ethical standards in all our work</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Users className="text-primary-600 mt-1 mr-3" size={20} />
                  <div>
                    <h4 className="font-semibold text-gray-900">Teamwork</h4>
                    <p className="text-gray-600">Collaborative approach to achieving our goals</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Heart className="text-primary-600 mt-1 mr-3" size={20} />
                  <div>
                    <h4 className="font-semibold text-gray-900">Passion</h4>
                    <p className="text-gray-600">Dedicated commitment to improving health outcomes</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <BookOpen className="text-primary-600 mt-1 mr-3" size={20} />
                  <div>
                    <h4 className="font-semibold text-gray-900">Continuous Learning</h4>
                    <p className="text-gray-600">Commitment to ongoing education and development</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Lightbulb className="text-primary-600 mt-1 mr-3" size={20} />
                  <div>
                    <h4 className="font-semibold text-gray-900">Innovation and Creativity</h4>
                    <p className="text-gray-600">Embracing new ideas and creative solutions</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {programFeatures.map((feature, index) => (
                <Card key={index} className="text-center p-6">
                  <feature.icon className="text-primary-600 mx-auto mb-4" size={32} />
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              CDPTA Team
            </h2>
            <p className="text-xl text-gray-600">
              Meet our dedicated team of experts in drug policy and technology assessment
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-primary-600" size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Abeer A. Al-Rabayah</h3>
              <p className="text-sm text-gray-600 mb-2">Head, Center for Drug Policy and Technology Assessment</p>
              <p className="text-xs text-gray-500">BSc Pharm, MBA, MSc (iHTA), PMP</p>
            </Card>


            <Card className="p-6 text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-primary-600" size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Razan Sawalha</h3>
              <p className="text-sm text-gray-600 mb-2">Research Specialist</p>
              <p className="text-xs text-gray-500">BS Pharm, MSc (Health Econ)</p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-primary-600" size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Maha Dalbah</h3>
              <p className="text-sm text-gray-600 mb-2">Clinical Specialist</p>
              <p className="text-xs text-gray-500">Pharm.D. BCOP</p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-primary-600" size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Khader Habash</h3>
              <p className="text-sm text-gray-600 mb-2">Clinical Specialist</p>
              <p className="text-xs text-gray-500">Pharm.D</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Announcements Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Latest Announcements
            </h2>
            <p className="text-xl text-gray-600">
              Stay updated with the latest news and opportunities from CDPTA
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Announcements List */}
            <div className="space-y-4">
              {publicAnnouncements.length === 0 ? (
                <Card className="p-6 text-center text-gray-600">No announcements yet.</Card>
              ) : (
                publicAnnouncements.slice(0, 4).map((announcement) => (
                  <AnnouncementCard
                    key={announcement.id}
                    announcement={announcement}
                    onClick={setSelectedAnnouncement}
                    compact={false}
                    showAuthor={true}
                    showTags={true}
                  />
                ))
              )}
            </div>

            {/* Selected Announcement Detail */}
            <div>
              {selectedAnnouncement ? (
                <Card className="h-full">
                  <div className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="flex items-center space-x-2">
                        {selectedAnnouncement.isImportant && (
                          <Star className="text-yellow-500" size={20} />
                        )}
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {selectedAnnouncement.title}
                          </h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Clock size={12} className="mr-1" />
                            {new Date(selectedAnnouncement.date).toLocaleDateString()}
                            <span className="mx-2">•</span>
                            <span>{selectedAnnouncement.authorName}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {selectedAnnouncement.content}
                    </p>

                    {/* Tags */}
                    {selectedAnnouncement.tags && selectedAnnouncement.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {selectedAnnouncement.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Important Notice */}
                    {selectedAnnouncement.isImportant && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                        <div className="flex items-center">
                          <Star className="text-yellow-500 mr-2" size={16} />
                          <span className="text-sm font-medium text-yellow-800">
                            Important Announcement
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Expiration Notice */}
                    {selectedAnnouncement.expiresAt && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <div className="flex items-center">
                          <Clock className="text-red-500 mr-2" size={16} />
                          <span className="text-sm font-medium text-red-800">
                            Expires: {new Date(selectedAnnouncement.expiresAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ) : (
                <Card className="h-full flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Mail size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>Select an announcement to view details</p>
                  </div>
                </Card>
              )}
            </div>
          </div>

          {/* View All Announcements Button */}
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              View All Announcements
              <ArrowRight size={20} className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Programs
            </h2>
            <p className="text-xl text-gray-600">
              Specialized training programs in health technology assessment and drug policy
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <UserPlus className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">HTA Fellowship Program</h3>
              <p className="text-gray-600 mb-6">
                The HTA Fellowship Program (HTA-FP) aims to build capacities for conducting health technology 
                assessments and health economics. The program provides fellows with individualized post-graduate 
                training to become independent HTA researchers.
              </p>
              <Link to="/apply">
                <Button variant="outline" className="w-full">
                  Apply for Fellowship
                </Button>
              </Link>
            </Card>

            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Drug Information Services</h3>
              <p className="text-gray-600 mb-6">
                Comprehensive drug information and pharmacovigilance services for healthcare providers, 
                policymakers, and patients to support evidence-based decision making.
              </p>
              <Button variant="outline" className="w-full" disabled>
                Contact Us
              </Button>
            </Card>

            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="text-purple-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Economic Evaluation</h3>
              <p className="text-gray-600 mb-6">
                Specialized economic evaluation assessments and Decision Analytical Modeling (DAM) 
                to support healthcare decision-making and resource allocation.
              </p>
              <Button variant="outline" className="w-full" disabled>
                Contact Us
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-primary-100">
              Join our community of researchers, practitioners, and policy makers
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="mr-3" size={20} />
                  <span>cdpta@khcc.jo</span>
                </div>
                <div className="flex items-center">
                  <Phone className="mr-3" size={20} />
                  <span>+962 6 530 0460</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-3" size={20} />
                  <span>King Hussein Cancer Center, Amman, Jordan</span>
                </div>
                <div className="flex items-center">
                  <ExternalLink className="mr-3" size={20} />
                  <a href="https://www.khcc.jo/en/center-for-drug-policy-and-technology-assessment-cdpta" 
                     target="_blank" rel="noopener noreferrer" 
                     className="hover:text-primary-200 underline">
                    Visit CDPTA Website
                  </a>
                </div>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6">Apply Today</h3>
              <p className="text-primary-100 mb-8">
                Don't miss the opportunity to advance your career in drug policy and technology assessment.
              </p>
              <div className="space-y-4">
                <Link to="/apply">
                  <Button size="lg" variant="secondary" className="w-full">
                    Start Your Fellowship Application
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="w-full border-white text-white hover:bg-white hover:text-primary-600">
                    Continue Existing Application
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <GraduationCap className="text-gray-900" size={20} />
                </div>
                <div>
                  <h3 className="font-bold">CDPTA</h3>
                  <p className="text-sm text-gray-400">Drug Policy & Technology Assessment</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                A pioneering regional center providing hospital-based health technology assessment (HB-HTA) services, 
                drug information, and pharmacovigilance services.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Programs</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/apply" className="hover:text-white">HTA Fellowship Program</Link></li>
                <li><a href="#" className="hover:text-white">Drug Information Services</a></li>
                <li><a href="#" className="hover:text-white">Economic Evaluation</a></li>
                <li><a href="#" className="hover:text-white">HB-HTA Reports</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">HTA Reports</a></li>
                <li><a href="#" className="hover:text-white">Drug Policy Briefs</a></li>
                <li><a href="#" className="hover:text-white">Economic Assessments</a></li>
                <li><a href="#" className="hover:text-white">Research Publications</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Help Center</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 King Hussein Cancer Center - Center for Drug Policy & Technology Assessment. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLandingPage;
