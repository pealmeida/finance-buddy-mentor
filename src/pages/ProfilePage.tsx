
import React, { useState } from 'react';
import Header from '@/components/Header';
import { UserProfile } from '@/types/finance';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { DollarSign, Mail, Save, User } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

interface ProfilePageProps {
  userProfile: UserProfile;
  onProfileUpdate: (updatedProfile: UserProfile) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ userProfile, onProfileUpdate }) => {
  const [profile, setProfile] = useState<UserProfile>({...userProfile});
  const { toast } = useToast();
  
  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSaveProfile = () => {
    onProfileUpdate(profile);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved.",
      duration: 3000
    });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header onboardingComplete={true} />
      
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <Link to="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-8">
          <Tabs defaultValue="personal" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="financial">Financial Profile</TabsTrigger>
              <TabsTrigger value="goals">Goals & Investments</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        id="email" 
                        type="email"
                        value={profile.email} 
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="johndoe@example.com"
                        className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-finance-blue"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        id="name" 
                        value={profile.name} 
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="John Doe"
                        className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-finance-blue"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input 
                      id="age" 
                      type="number" 
                      value={profile.age} 
                      onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                      placeholder="30"
                      className="transition-all duration-300 focus:ring-2 focus:ring-finance-blue"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="financial" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Financial Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="income">Monthly Income ($)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        id="income" 
                        type="number" 
                        value={profile.monthlyIncome} 
                        onChange={(e) => handleInputChange('monthlyIncome', parseInt(e.target.value) || 0)}
                        placeholder="5000"
                        className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-finance-blue"
                      />
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-4">
                    <Label>Risk Profile</Label>
                    <RadioGroup 
                      value={profile.riskProfile} 
                      onValueChange={(value) => handleInputChange('riskProfile', value)}
                      className="space-y-2"
                    >
                      <div className="flex items-start space-x-3 rounded-lg border p-3 hover:bg-gray-50">
                        <RadioGroupItem value="conservative" id="conservative" className="mt-1" />
                        <div>
                          <Label htmlFor="conservative" className="font-medium">Conservative</Label>
                          <p className="text-xs text-gray-500">Prioritize preserving capital</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3 rounded-lg border p-3 hover:bg-gray-50">
                        <RadioGroupItem value="moderate" id="moderate" className="mt-1" />
                        <div>
                          <Label htmlFor="moderate" className="font-medium">Moderate</Label>
                          <p className="text-xs text-gray-500">Balance growth and preservation</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3 rounded-lg border p-3 hover:bg-gray-50">
                        <RadioGroupItem value="aggressive" id="aggressive" className="mt-1" />
                        <div>
                          <Label htmlFor="aggressive" className="font-medium">Aggressive</Label>
                          <p className="text-xs text-gray-500">Maximize long-term growth</p>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="emergency" 
                        checked={profile.hasEmergencyFund} 
                        onCheckedChange={(checked) => handleInputChange('hasEmergencyFund', !!checked)}
                      />
                      <Label htmlFor="emergency">I have an emergency fund (3-6 months of expenses)</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="debts" 
                        checked={profile.hasDebts} 
                        onCheckedChange={(checked) => handleInputChange('hasDebts', !!checked)}
                      />
                      <Label htmlFor="debts">I have high-interest debts (credit cards, personal loans)</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="goals" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Financial Goals</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 mb-4">
                    View and manage your financial goals and investments.
                  </p>
                  <Button 
                    variant="outline" 
                    className="text-finance-blue border-finance-blue hover:bg-finance-blue hover:text-white"
                  >
                    Manage Goals
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Investment Portfolio</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 mb-4">
                    View and manage your investment portfolio.
                  </p>
                  <Button 
                    variant="outline"
                    className="text-finance-blue border-finance-blue hover:bg-finance-blue hover:text-white"
                  >
                    Manage Investments
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end mt-8">
            <Button 
              onClick={handleSaveProfile}
              className="bg-finance-blue hover:bg-finance-blue-dark text-white transition-all duration-300 shadow-button hover:shadow-button-hover flex items-center gap-2"
            >
              <Save className="h-4 w-4" /> 
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
