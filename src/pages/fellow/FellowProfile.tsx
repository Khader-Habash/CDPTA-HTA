import React from 'react';
import Card from '@/components/ui/Card';
import { User } from 'lucide-react';

const FellowProfile: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Fellow Profile</h1>
        <p className="text-gray-600">Manage your fellowship profile and information.</p>
      </div>

      <Card>
        <Card.Content>
          <div className="text-center py-12">
            <User className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Fellow Profile Page</h3>
            <p className="text-gray-600">Fellow-specific profile management would be implemented here.</p>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default FellowProfile;

