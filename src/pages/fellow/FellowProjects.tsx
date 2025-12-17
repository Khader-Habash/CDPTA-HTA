import React from 'react';
import Card from '@/components/ui/Card';
import { Briefcase } from 'lucide-react';

const FellowProjects: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
        <p className="text-gray-600">Track and manage your fellowship projects.</p>
      </div>

      <Card>
        <Card.Content>
          <div className="text-center py-12">
            <Briefcase className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Projects Management</h3>
            <p className="text-gray-600">Fellow projects management interface would be implemented here.</p>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default FellowProjects;

