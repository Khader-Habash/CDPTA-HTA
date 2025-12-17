import React from 'react';
import Card from '@/components/ui/Card';
import { Shield, Lock, Eye, Database, Calendar } from 'lucide-react';

const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 bg-primary-600 rounded-lg flex items-center justify-center mb-4">
            <Lock className="text-white" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="mt-2 text-gray-600">CDPTA Platform Privacy and Data Protection</p>
          <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
            <Calendar size={16} className="mr-2" />
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>

        <Card>
          <Card.Content className="prose max-w-none">
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Personal Information</h3>
                    <p className="text-gray-700 leading-relaxed mb-2">
                      We collect information you provide directly to us, such as when you create an account, 
                      fill out an application, or contact us for support. This may include:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                      <li>Name, email address, and phone number</li>
                      <li>Professional information (organization, position, department)</li>
                      <li>Address and contact details</li>
                      <li>KHCC Staff ID (if applicable)</li>
                      <li>Research interests and academic background</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Usage Information</h3>
                    <p className="text-gray-700 leading-relaxed">
                      We automatically collect certain information about your use of our platform, including 
                      your IP address, browser type, device information, and pages visited.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Provide, maintain, and improve our platform services</li>
                  <li>Process applications and manage fellowship programs</li>
                  <li>Communicate with you about your account and our services</li>
                  <li>Send you technical notices, updates, and support messages</li>
                  <li>Respond to your comments, questions, and requests</li>
                  <li>Monitor and analyze trends, usage, and activities</li>
                  <li>Detect, investigate, and prevent fraudulent transactions</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Information Sharing</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We do not sell, trade, or otherwise transfer your personal information to third parties 
                  without your consent, except in the following circumstances:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>With your explicit consent</li>
                  <li>To comply with legal obligations or court orders</li>
                  <li>To protect our rights, property, or safety</li>
                  <li>With trusted service providers who assist us in operating our platform</li>
                  <li>In connection with a merger, acquisition, or sale of assets</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    We implement appropriate technical and organizational security measures to protect your 
                    personal information against unauthorized access, alteration, disclosure, or destruction.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Shield className="text-blue-600 mr-2" size={20} />
                        <h4 className="font-medium text-blue-900">Encryption</h4>
                      </div>
                      <p className="text-blue-700 text-sm">
                        All data is encrypted in transit and at rest using industry-standard protocols.
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Lock className="text-green-600 mr-2" size={20} />
                        <h4 className="font-medium text-green-900">Access Control</h4>
                      </div>
                      <p className="text-green-700 text-sm">
                        Strict access controls ensure only authorized personnel can access your data.
                      </p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Eye className="text-purple-600 mr-2" size={20} />
                        <h4 className="font-medium text-purple-900">Monitoring</h4>
                      </div>
                      <p className="text-purple-700 text-sm">
                        Continuous monitoring and logging of all data access and modifications.
                      </p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Database className="text-orange-600 mr-2" size={20} />
                        <h4 className="font-medium text-orange-900">Backup</h4>
                      </div>
                      <p className="text-orange-700 text-sm">
                        Regular backups with secure storage and recovery procedures.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Your Rights</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You have the following rights regarding your personal information:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li><strong>Access:</strong> Request access to your personal information</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                  <li><strong>Restriction:</strong> Request restriction of processing of your data</li>
                  <li><strong>Objection:</strong> Object to processing of your personal information</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Data Retention</h2>
                <p className="text-gray-700 leading-relaxed">
                  We retain your personal information for as long as necessary to fulfill the purposes 
                  outlined in this privacy policy, unless a longer retention period is required or 
                  permitted by law. When we no longer need your information, we will securely delete 
                  or anonymize it.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Cookies and Tracking</h2>
                <p className="text-gray-700 leading-relaxed">
                  We use cookies and similar tracking technologies to enhance your experience on our 
                  platform. You can control cookie settings through your browser preferences, but 
                  disabling cookies may affect platform functionality.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">8. International Transfers</h2>
                <p className="text-gray-700 leading-relaxed">
                  Your information may be transferred to and processed in countries other than your 
                  country of residence. We ensure appropriate safeguards are in place to protect your 
                  personal information in accordance with this privacy policy.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Children's Privacy</h2>
                <p className="text-gray-700 leading-relaxed">
                  Our platform is not intended for children under 16 years of age. We do not knowingly 
                  collect personal information from children under 16. If you are a parent or guardian 
                  and believe your child has provided us with personal information, please contact us.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Changes to This Policy</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may update this privacy policy from time to time. We will notify you of any changes 
                  by posting the new privacy policy on this page and updating the "Last updated" date. 
                  You are advised to review this privacy policy periodically for any changes.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Contact Us</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">
                    <strong>Data Protection Officer:</strong> privacy@cdpta.org<br />
                    <strong>General Inquiries:</strong> info@cdpta.org<br />
                    <strong>Address:</strong> Center for Drug Policy & Technology Assessment<br />
                    <strong>Phone:</strong> +1 (555) 123-4567
                  </p>
                </div>
              </section>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPage;

