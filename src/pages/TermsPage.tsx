import React from 'react';
import Card from '@/components/ui/Card';
import { Shield, FileText, Calendar } from 'lucide-react';

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 bg-primary-600 rounded-lg flex items-center justify-center mb-4">
            <Shield className="text-white" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
          <p className="mt-2 text-gray-600">CDPTA Platform Terms and Conditions</p>
          <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
            <Calendar size={16} className="mr-2" />
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>

        <Card>
          <Card.Content className="prose max-w-none">
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  By accessing and using the Center for Drug Policy & Technology Assessment (CDPTA) platform, 
                  you accept and agree to be bound by the terms and provision of this agreement. If you do not 
                  agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Use License</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Permission is granted to temporarily use the CDPTA platform for personal, non-commercial 
                  transitory viewing only. This is the grant of a license, not a transfer of title, and under 
                  this license you may not:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for any commercial purpose or for any public display</li>
                  <li>Attempt to reverse engineer any software contained on the platform</li>
                  <li>Remove any copyright or other proprietary notations from the materials</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  When you create an account with us, you must provide information that is accurate, 
                  complete, and current at all times. You are responsible for safeguarding the password 
                  and for all activities that occur under your account.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  You agree not to disclose your password to any third party and to take sole responsibility 
                  for any activities or actions under your account, whether or not you have authorized such 
                  activities or actions.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Privacy Policy</h2>
                <p className="text-gray-700 leading-relaxed">
                  Your privacy is important to us. Please review our Privacy Policy, which also governs 
                  your use of the platform, to understand our practices.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Prohibited Uses</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You may not use our platform:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                  <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                  <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                  <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                  <li>To submit false or misleading information</li>
                  <li>To upload or transmit viruses or any other type of malicious code</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Content</h2>
                <p className="text-gray-700 leading-relaxed">
                  Our platform allows you to post, link, store, share and otherwise make available certain 
                  information, text, graphics, videos, or other material. You are responsible for the content 
                  that you post to the platform, including its legality, reliability, and appropriateness.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Termination</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may terminate or suspend your account and bar access to the platform immediately, 
                  without prior notice or liability, under our sole discretion, for any reason whatsoever 
                  and without limitation, including but not limited to a breach of the Terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Disclaimer</h2>
                <p className="text-gray-700 leading-relaxed">
                  The information on this platform is provided on an "as is" basis. To the fullest extent 
                  permitted by law, this Company excludes all representations, warranties, conditions and 
                  terms relating to our platform and the use of this platform.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Governing Law</h2>
                <p className="text-gray-700 leading-relaxed">
                  These Terms shall be interpreted and governed by the laws of the jurisdiction in which 
                  the CDPTA operates, without regard to its conflict of law provisions.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Contact Information</h2>
                <p className="text-gray-700 leading-relaxed">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">
                    <strong>Email:</strong> legal@cdpta.org<br />
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

export default TermsPage;

