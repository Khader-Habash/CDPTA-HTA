import React from 'react';
import Card from '@/components/ui/Card';
import { BarChart3 } from 'lucide-react';

const Analytics: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600">View platform analytics and performance metrics.</p>
      </div>

      <Card>
        <Card.Content>
          <div className="text-center py-12">
            <BarChart3 className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Platform Analytics</h3>
            <p className="text-gray-600">Comprehensive analytics dashboard would be implemented here.</p>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default Analytics;

