import React from 'react';
import Card from '@/components/ui/Card';
import { Users } from 'lucide-react';

const ManageFellows: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manage Fellows</h1>
        <p className="text-gray-600">Monitor fellow progress and provide mentorship.</p>
      </div>

      <Card>
        <Card.Content>
          <div className="text-center py-12">
            <Users className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Fellow Management</h3>
            <p className="text-gray-600">Fellow management interface would be implemented here.</p>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default ManageFellows;

