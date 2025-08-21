import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Bell } from 'lucide-react';

// Top navigation tabs - starting with Organization Overview
const TOP_TABS = [
  { id: 'organization-overview', label: 'Organization Overview' },
  { id: 'initiative-overview', label: 'Initiative Overview' },
  { id: 'clinical-trials', label: 'Clinical Trials' },
  { id: 'xxxx', label: 'XXXX' },
  { id: 'xxx', label: 'XXX' }
];

export function EMMEComprehensiveProjectCreator() {
  const [activeTab, setActiveTab] = useState('organization-overview');
  const [projectName, setProjectName] = useState('VMS Global');

  const handleNextStep = () => {
    const tabOrder = ['organization-overview', 'initiative-overview', 'clinical-trials', 'xxxx', 'xxx'];
    const currentIndex = tabOrder.indexOf(activeTab);
    if (currentIndex < tabOrder.length - 1) {
      setActiveTab(tabOrder[currentIndex + 1]);
    }
  };

  const handlePreviousStep = () => {
    const tabOrder = ['organization-overview', 'initiative-overview', 'clinical-trials', 'xxxx', 'xxx'];
    const currentIndex = tabOrder.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabOrder[currentIndex - 1]);
    }
  };

  const renderOrganizationOverview = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Project Setup - Organization Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Project Name</label>
            <Input 
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name (e.g., VMS Global)"
              className="text-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Organization Type</label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select organization type" />
              </SelectTrigger>
              <SelectContent className="z-50">
                <SelectItem value="pharmaceutical">Pharmaceutical Company</SelectItem>
                <SelectItem value="biotech">Biotechnology Company</SelectItem>
                <SelectItem value="medical-device">Medical Device Company</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Primary Therapeutic Area</label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select primary therapeutic area" />
              </SelectTrigger>
              <SelectContent className="z-50">
                <SelectItem value="womens-health">Women's Health</SelectItem>
                <SelectItem value="oncology">Oncology</SelectItem>
                <SelectItem value="neurology">Neurology</SelectItem>
                <SelectItem value="cardiology">Cardiology</SelectItem>
                <SelectItem value="endocrinology">Endocrinology</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" disabled>Previous</Button>
            <Button onClick={handleNextStep}>Next: Initiative Overview</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderInitiativeOverview = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Human Insights & Patient Journey</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Patient Population</label>
            <Textarea 
              placeholder="Describe target patient population and unmet needs..."
              className="min-h-[100px]"
            />
            <p className="text-xs text-gray-500 mt-1">
              Example: Women experiencing vasomotor symptoms during menopause, particularly those seeking non-hormonal treatment options
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Healthcare Provider Insights</label>
            <Textarea 
              placeholder="Key insights from healthcare providers..."
              className="min-h-[100px]"
            />
            <p className="text-xs text-gray-500 mt-1">
              Example: Clinicians need effective non-hormonal alternatives for patients with contraindications to hormone therapy
            </p>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={handlePreviousStep}>Previous</Button>
            <Button onClick={handleNextStep}>Next: Clinical Trials</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderClinicalTrials = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Clinical Development Program</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Development Stage</label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select current development stage" />
              </SelectTrigger>
              <SelectContent className="z-50">
                <SelectItem value="phase-1">Phase 1</SelectItem>
                <SelectItem value="phase-2">Phase 2</SelectItem>
                <SelectItem value="phase-3">Phase 3</SelectItem>
                <SelectItem value="nda-prep">NDA Preparation</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Key Clinical Endpoints</label>
            <Textarea 
              placeholder="Primary and secondary endpoints..."
              className="min-h-[100px]"
            />
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={handlePreviousStep}>Previous</Button>
            <Button onClick={handleNextStep}>Next: XXXX</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'organization-overview':
        return renderOrganizationOverview();
      case 'initiative-overview':
        return renderInitiativeOverview();
      case 'clinical-trials':
        return renderClinicalTrials();
      case 'xxxx':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Additional Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Configuration options for XXXX module</p>
                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={handlePreviousStep}>Previous</Button>
                  <Button onClick={handleNextStep}>Next: XXX</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'xxx':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Final Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Final setup options for XXX module</p>
                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={handlePreviousStep}>Previous</Button>
                  <Button>Complete Setup</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return renderOrganizationOverview();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{projectName} - Project Setup</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search..."
                  className="pl-10 w-64"
                />
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700">
                New Project
              </Button>
              <Bell className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Top Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="flex items-center px-4">
            {TOP_TABS.map((tab) => (
              <button
                key={tab.id}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  tab.id === activeTab
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}