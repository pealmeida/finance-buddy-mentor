
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface SavingsAnalysisStatsProps {
  totalSaved: number;
  averageSaved: number;
  profile: any;
  selectedYear: number;
}

const SavingsAnalysisStats: React.FC<SavingsAnalysisStatsProps> = ({
  totalSaved,
  averageSaved,
  profile,
  selectedYear
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card>
        <CardHeader>
          <CardTitle>Total Saved</CardTitle>
          <CardDescription>Amount saved in {selectedYear}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-green-600">${totalSaved.toLocaleString()}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Monthly Average</CardTitle>
          <CardDescription>Average savings per month</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-blue-600">${averageSaved.toLocaleString()}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Yearly Goal</CardTitle>
          <CardDescription>Progress towards your yearly goal</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-purple-600">
            {profile?.monthlySavings ? "On Track" : "Set a Goal"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SavingsAnalysisStats;
