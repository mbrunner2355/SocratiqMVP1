import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users,
  Plus, 
  Building,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  TrendingUp,
  FolderOpen,
  MoreVertical,
  Edit,
  Trash,
  Eye
} from "lucide-react";

export function ClientManager() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    size: "",
    location: "",
    contactName: "",
    contactTitle: "",
    email: "",
    phone: "",
    website: "",
    notes: ""
  });

  // Mock client data
  const clients = [
    {
      id: "client-001",
      name: "PharmaCorp Global",
      logo: "/api/placeholder/40/40",
      industry: "Pharmaceuticals",
      size: "Large Enterprise",
      contactName: "Dr. Sarah Johnson",
      email: "sarah.johnson@pharmacorp.com",
      phone: "+1 (555) 123-4567",
      website: "www.pharmacorp.com",
      location: "New York, NY",
      status: "active",
      projects: 5,
      totalSpend: 1250000,
      joinDate: "2023-01-15",
      lastActivity: "2024-08-09"
    },
    {
      id: "client-002", 
      name: "MediHealth Solutions",
      logo: "/api/placeholder/40/40",
      industry: "Healthcare Technology",
      size: "Mid-Market",
      contactName: "Michael Chen",
      email: "m.chen@medihealth.com",
      phone: "+1 (555) 987-6543",
      website: "www.medihealth.com",
      location: "San Francisco, CA",
      status: "active",
      projects: 3,
      totalSpend: 680000,
      joinDate: "2023-06-10",
      lastActivity: "2024-08-08"
    },
    {
      id: "client-003",
      name: "BioTech Innovations",
      logo: "/api/placeholder/40/40",
      industry: "Biotechnology",
      size: "Growth Company",
      contactName: "Dr. Emily Rodriguez",
      email: "emily.r@biotech-innov.com",
      phone: "+1 (555) 456-7890",
      website: "www.biotech-innovations.com",
      location: "Boston, MA",
      status: "active",
      projects: 2,
      totalSpend: 420000,
      joinDate: "2023-11-03",
      lastActivity: "2024-08-10"
    },
    {
      id: "client-004",
      name: "Global Therapeutics",
      logo: "/api/placeholder/40/40",
      industry: "Pharmaceuticals",
      size: "Large Enterprise",
      contactName: "James Wilson",
      email: "james.wilson@globalthera.com",
      phone: "+1 (555) 234-5678",
      website: "www.globaltherapeutics.com",
      location: "Chicago, IL",
      status: "inactive",
      projects: 1,
      totalSpend: 180000,
      joinDate: "2022-08-20",
      lastActivity: "2024-05-15"
    }
  ];

  const handleCreateClient = () => {
    // Validate form
    if (!formData.name || !formData.industry || !formData.contactName || !formData.email) {
      alert("Please fill in all required fields");
      return;
    }

    // In a real app, this would make an API call
    console.log("Creating client:", formData);
    
    // Show success message and go back to list
    alert("Client added successfully!");
    setShowCreateForm(false);
    
    // Reset form
    setFormData({
      name: "",
      industry: "",
      size: "",
      location: "",
      contactName: "",
      contactTitle: "",
      email: "",
      phone: "",
      website: "",
      notes: ""
    });
  };

  const CreateClientForm = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Add New Client</h2>
          <Button variant="outline" onClick={() => setShowCreateForm(false)}>
            Cancel
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="company-name">Company Name *</Label>
            <Input 
              id="company-name" 
              placeholder="e.g., PharmaCorp Global"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="industry">Industry *</Label>
            <Select value={formData.industry} onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pharmaceuticals">Pharmaceuticals</SelectItem>
                <SelectItem value="biotechnology">Biotechnology</SelectItem>
                <SelectItem value="medical-devices">Medical Devices</SelectItem>
                <SelectItem value="healthcare-tech">Healthcare Technology</SelectItem>
                <SelectItem value="diagnostics">Diagnostics</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="company-size">Company Size</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select company size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="startup">Startup (1-50)</SelectItem>
                <SelectItem value="growth">Growth Company (51-200)</SelectItem>
                <SelectItem value="mid-market">Mid-Market (201-1000)</SelectItem>
                <SelectItem value="enterprise">Large Enterprise (1000+)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" placeholder="City, State/Country" />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Primary Contact Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="contact-name">Contact Name *</Label>
              <Input id="contact-name" placeholder="Dr. Sarah Johnson" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact-title">Title</Label>
              <Input id="contact-title" placeholder="VP of Marketing" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" placeholder="sarah.johnson@company.com" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" placeholder="+1 (555) 123-4567" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input id="website" placeholder="www.company.com" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea 
            id="notes" 
            placeholder="Additional information about the client..."
            rows={3}
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button variant="outline" onClick={() => setShowCreateForm(false)}>
            Cancel
          </Button>
          <Button 
            style={{ backgroundColor: '#9B7FB8' }}
            onClick={handleCreateClient}
          >
            Add Client
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const ClientsList = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Client Management</h1>
          <p className="text-gray-600">Manage your pharmaceutical marketing clients</p>
        </div>
        <Button 
          style={{ backgroundColor: '#9B7FB8' }}
          onClick={() => setShowCreateForm(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </Button>
      </div>

      {/* Client Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Clients</p>
                <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
              </div>
              <Building className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Clients</p>
                <p className="text-2xl font-bold text-gray-900">
                  {clients.filter(c => c.status === 'active').length}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900">
                  {clients.reduce((sum, c) => sum + c.projects, 0)}
                </p>
              </div>
              <FolderOpen className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${(clients.reduce((sum, c) => sum + c.totalSpend, 0) / 1000000).toFixed(1)}M
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {clients.map((client) => (
          <Card key={client.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={client.logo} />
                    <AvatarFallback>
                      {client.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{client.name}</h3>
                    <p className="text-sm text-gray-600">{client.industry}</p>
                    <Badge variant={client.status === 'active' ? 'default' : 'secondary'} className="mt-1">
                      {client.status}
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Projects</p>
                  <p className="font-medium flex items-center">
                    <FolderOpen className="w-3 h-3 mr-1" />
                    {client.projects}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Total Spend</p>
                  <p className="font-medium">${(client.totalSpend / 1000).toFixed(0)}K</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Users className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-600">{client.contactName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-600">{client.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-600">{client.location}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-3 h-3" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Joined: {new Date(client.joinDate).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  if (showCreateForm) {
    return <CreateClientForm />;
  }

  return <ClientsList />;
}