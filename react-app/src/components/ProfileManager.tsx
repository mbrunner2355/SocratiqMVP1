import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  User, 
  FileText, 
  Database, 
  Settings,
  Plus,
  Search,
  Shield,
  Activity,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Clock,
  Star
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface UserProfile {
  id: string;
  userId: string;
  displayName: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLogin?: string;
  activityStats: Record<string, any>;
  createdAt: string;
}

interface DocumentProfile {
  id: string;
  documentId: string;
  qualityScore?: number;
  complexityScore?: number;
  confidenceScore?: number;
  annotations: any[];
  classifications: any[];
  complianceFlags: any[];
  usageStats: Record<string, any>;
  createdAt: string;
}

interface EntityProfile {
  id: string;
  entityId: string;
  canonicalName?: string;
  aliases: string[];
  category?: string;
  verificationStatus: string;
  importance: number;
  documentFrequency: number;
  relationshipSummary: Record<string, number>;
  createdAt: string;
}

export function ProfileManager() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  // Fetch data
  const { data: userProfiles, isLoading: usersLoading } = useQuery<UserProfile[]>({
    queryKey: ['/api/profile/users'],
  });

  const { data: documentProfiles, isLoading: documentsLoading } = useQuery<DocumentProfile[]>({
    queryKey: ['/api/profile/documents'],
  });

  const { data: entityProfiles, isLoading: entitiesLoading } = useQuery<EntityProfile[]>({
    queryKey: ['/api/profile/entities'],
  });

  const { data: userAnalytics } = useQuery({
    queryKey: ['/api/profile/analytics/users'],
  });

  const { data: documentAnalytics } = useQuery({
    queryKey: ['/api/profile/analytics/documents'],
  });

  const { data: entityAnalytics } = useQuery({
    queryKey: ['/api/profile/analytics/entities'],
  });

  // Create user profile mutation
  const createUserMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/profile/users', {
      method: 'POST',
      body: data
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/profile/users'] });
    }
  });

  // Verify entity mutation
  const verifyEntityMutation = useMutation({
    mutationFn: ({ entityId, status }: { entityId: string; status: string }) =>
      apiRequest(`/api/profile/entities/${entityId}/verify`, {
        method: 'POST',
        body: { status, verifiedBy: 'current-user', notes: `Verified as ${status}` }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/profile/entities'] });
    }
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'analyst': return 'bg-blue-100 text-blue-800';
      case 'viewer': return 'bg-green-100 text-green-800';
      case 'guest': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getVerificationColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'disputed': return 'bg-red-100 text-red-800';
      case 'unverified': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getQualityColor = (score?: number) => {
    if (!score) return 'bg-gray-100 text-gray-800';
    if (score >= 0.8) return 'bg-green-100 text-green-800';
    if (score >= 0.5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const handleCreateUser = () => {
    createUserMutation.mutate({
      userId: `user_${Date.now()}`,
      displayName: 'New User',
      email: `user${Date.now()}@example.com`,
      role: 'analyst',
      preferences: {},
      permissions: [],
      activityStats: {}
    });
  };

  const handleVerifyEntity = (entityId: string, status: string) => {
    verifyEntityMutation.mutate({ entityId, status });
  };

  if (usersLoading || documentsLoading || entitiesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading Profile™ module...</p>
        </div>
      </div>
    );
  }

  // Filter profiles based on search term
  const filteredUsers = userProfiles?.filter(user =>
    user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEntities = entityProfiles?.filter(entity =>
    entity.canonicalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entity.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SocratIQ Profile™</h1>
          <p className="text-muted-foreground">
            Comprehensive profiling and management system
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search profiles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
          <Button onClick={handleCreateUser} disabled={createUserMutation.isPending}>
            <Plus className="h-4 w-4 mr-2" />
            New User
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users ({userProfiles?.length || 0})</TabsTrigger>
          <TabsTrigger value="documents">Documents ({documentProfiles?.length || 0})</TabsTrigger>
          <TabsTrigger value="entities">Entities ({entityProfiles?.length || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Analytics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userAnalytics?.totalUsers || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {userAnalytics?.activeUsers || 0} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Document Profiles</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{documentAnalytics?.totalProfiles || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Avg quality: {(documentAnalytics?.avgQualityScore * 100 || 0).toFixed(0)}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Entity Profiles</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{entityAnalytics?.totalProfiles || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {entityAnalytics?.verifiedEntities || 0} verified
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Health</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">98.5%</div>
                <p className="text-xs text-muted-foreground">
                  All systems operational
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quality Distribution */}
          {documentAnalytics?.qualityDistribution && (
            <Card>
              <CardHeader>
                <CardTitle>Document Quality Distribution</CardTitle>
                <CardDescription>Quality scores across all document profiles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-sm">High Quality: {documentAnalytics.qualityDistribution.high}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    <span className="text-sm">Medium Quality: {documentAnalytics.qualityDistribution.medium}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span className="text-sm">Low Quality: {documentAnalytics.qualityDistribution.low}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Profiles</CardTitle>
              <CardDescription>Manage user accounts, roles, and access permissions</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredUsers && filteredUsers.length > 0 ? (
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <Card key={user.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-medium">{user.displayName}</h4>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge className={getRoleColor(user.role)}>
                                  {user.role}
                                </Badge>
                                {user.isActive ? (
                                  <Badge variant="outline" className="bg-green-50 text-green-700">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Active
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-gray-50 text-gray-700">
                                    Inactive
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right text-sm text-muted-foreground">
                            {user.lastLogin && (
                              <p>Last login: {new Date(user.lastLogin).toLocaleDateString()}</p>
                            )}
                            <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <User className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No user profiles found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm ? 'Try adjusting your search terms' : 'Create your first user profile to get started'}
                  </p>
                  {!searchTerm && (
                    <Button onClick={handleCreateUser}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create User Profile
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Document Profiles</CardTitle>
              <CardDescription>Document quality metrics, annotations, and classifications</CardDescription>
            </CardHeader>
            <CardContent>
              {documentProfiles && documentProfiles.length > 0 ? (
                <div className="space-y-4">
                  {documentProfiles.slice(0, 10).map((profile) => (
                    <Card key={profile.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">Document {profile.documentId.slice(0, 8)}...</h4>
                              <div className="flex items-center space-x-2 mt-1">
                                {profile.qualityScore && (
                                  <Badge className={getQualityColor(profile.qualityScore)}>
                                    Quality: {(profile.qualityScore * 100).toFixed(0)}%
                                  </Badge>
                                )}
                                {profile.confidenceScore && (
                                  <Badge variant="outline">
                                    Confidence: {(profile.confidenceScore * 100).toFixed(0)}%
                                  </Badge>
                                )}
                                {profile.complianceFlags.length > 0 && (
                                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    {profile.complianceFlags.length} flags
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right text-sm text-muted-foreground">
                            <p>{profile.annotations.length} annotations</p>
                            <p>{profile.classifications.length} classifications</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No document profiles available</h3>
                  <p>Document profiles will appear here after processing documents</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="entities">
          <Card>
            <CardHeader>
              <CardTitle>Entity Profiles</CardTitle>
              <CardDescription>Entity verification, relationships, and importance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredEntities && filteredEntities.length > 0 ? (
                <div className="space-y-4">
                  {filteredEntities.slice(0, 10).map((entity) => (
                    <Card key={entity.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                              <Database className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">{entity.canonicalName || `Entity ${entity.entityId.slice(0, 8)}...`}</h4>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge className={getVerificationColor(entity.verificationStatus)}>
                                  {entity.verificationStatus}
                                </Badge>
                                {entity.category && (
                                  <Badge variant="outline">{entity.category}</Badge>
                                )}
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Star className="h-3 w-3 mr-1" />
                                  {entity.importance.toFixed(2)} importance
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="text-right text-sm text-muted-foreground">
                              <p>{entity.documentFrequency} documents</p>
                              <p>{entity.aliases.length} aliases</p>
                            </div>
                            {entity.verificationStatus === 'unverified' && (
                              <div className="flex flex-col space-y-1">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleVerifyEntity(entity.entityId, 'verified')}
                                  disabled={verifyEntityMutation.isPending}
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Verify
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleVerifyEntity(entity.entityId, 'disputed')}
                                  disabled={verifyEntityMutation.isPending}
                                >
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  Dispute
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Database className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No entity profiles found</h3>
                  <p>
                    {searchTerm ? 'Try adjusting your search terms' : 'Entity profiles will appear here after processing documents'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}