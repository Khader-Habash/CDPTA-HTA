import React from 'react';
import Card from '@/components/ui/Card';
import { Settings } from 'lucide-react';

const SystemSettings: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-600">Configure platform-wide settings and preferences.</p>
      </div>

      <Card>
        <Card.Content>
          <div className="text-center py-12">
            <Settings className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">System Settings</h3>
            <p className="text-gray-600">System configuration interface would be implemented here.</p>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default SystemSettings;

