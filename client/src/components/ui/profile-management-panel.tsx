import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Building2, 
  Shield, 
  Camera, 
  Check, 
  AlertCircle,
  Edit3,
  Save,
  X
} from "lucide-react";

interface ProfileManagementPanelProps {
  demoUser: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    profileImageUrl: string;
    jobTitle: string;
    company: string;
    location: string;
  };
}

const ProfileManagementPanel: React.FC<ProfileManagementPanelProps> = ({ demoUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: demoUser.firstName,
    lastName: demoUser.lastName,
    email: demoUser.email,
    phone: "+1 (555) 123-4567",
    jobTitle: demoUser.jobTitle,
    company: demoUser.company,
    location: demoUser.location,
    bio: "Senior Cloud Architect passionate about scalable infrastructure and modern DevOps practices. 8+ years of experience in enterprise cloud solutions."
  });

  const handleSave = () => {
    setIsEditing(false);
    // Mock save operation
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data
  };

  const sendVerificationEmail = () => {
    // Mock email verification
  };

  const sendVerificationSMS = () => {
    // Mock phone verification
  };

  return (
    <div className="w-full space-y-6">
      {/* Premium Glass Card Container */}
      <Card className="bg-white/85 dark:bg-white/8 backdrop-blur-2xl border-white/40 dark:border-white/15 shadow-2xl text-slate-900 dark:text-white ring-1 ring-white/10 dark:ring-white/5">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-primary/20">
              <User className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Profile Management
            </CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            Manage your professional profile and verification settings
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-100/60 dark:bg-white/8 backdrop-blur-sm border border-white/20 dark:border-white/10 text-slate-700 dark:text-white/90 rounded-lg">
              <TabsTrigger value="personal" className="data-[state=active]:bg-white/80 data-[state=active]:text-slate-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-white/15 dark:data-[state=active]:text-white rounded-md">
                Personal Info
              </TabsTrigger>
              <TabsTrigger value="professional" className="data-[state=active]:bg-white/80 data-[state=active]:text-slate-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-white/15 dark:data-[state=active]:text-white rounded-md">
                Professional
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-white/80 data-[state=active]:text-slate-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-white/15 dark:data-[state=active]:text-white rounded-md">
                Security
              </TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal" className="space-y-6 mt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                {!isEditing ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsEditing(true)}
                    className="bg-slate-100/70 dark:bg-white/8 border-slate-300/60 dark:border-white/15 hover:bg-slate-200/60 dark:hover:bg-white/12 text-slate-700 dark:text-white/90 backdrop-blur-sm"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleCancel}
                      className="bg-slate-100/70 dark:bg-white/8 border-slate-300/60 dark:border-white/15 hover:bg-slate-200/60 dark:hover:bg-white/12 text-slate-700 dark:text-white/90 backdrop-blur-sm"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleSave}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    disabled={!isEditing}
                    className="bg-slate-100/70 dark:bg-white/10 border-slate-300/50 dark:border-white/20 focus:bg-white dark:focus:bg-white/20 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-white/60"
                    data-testid="input-first-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    disabled={!isEditing}
                    className="bg-slate-100/70 dark:bg-white/10 border-slate-300/50 dark:border-white/20 focus:bg-white dark:focus:bg-white/20 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-white/60"
                    data-testid="input-last-name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  disabled={!isEditing}
                  className="bg-slate-100/70 dark:bg-white/10 border-slate-300/50 dark:border-white/20 focus:bg-white dark:focus:bg-white/20 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-white/60 min-h-[100px]"
                  placeholder="Tell us about yourself..."
                  data-testid="textarea-bio"
                />
              </div>
            </TabsContent>

            {/* Professional Information Tab */}
            <TabsContent value="professional" className="space-y-6 mt-6">
              <h3 className="text-lg font-semibold">Professional Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="jobTitle" className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Job Title
                  </Label>
                  <Input
                    id="jobTitle"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                    disabled={!isEditing}
                    className="bg-slate-100/70 dark:bg-white/10 border-slate-300/50 dark:border-white/20 focus:bg-white dark:focus:bg-white/20 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-white/60"
                    data-testid="input-job-title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Company
                  </Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    disabled={!isEditing}
                    className="bg-slate-100/70 dark:bg-white/10 border-slate-300/50 dark:border-white/20 focus:bg-white dark:focus:bg-white/20 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-white/60"
                    data-testid="input-company"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  disabled={!isEditing}
                  className="bg-slate-100/70 dark:bg-white/10 border-slate-300/50 dark:border-white/20 focus:bg-white dark:focus:bg-white/20 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-white/60"
                  data-testid="input-location"
                />
              </div>
            </TabsContent>

            {/* Security & Verification Tab */}
            <TabsContent value="security" className="space-y-6 mt-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security & Verification
              </h3>

              {/* Email Verification */}
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">Email Address</p>
                        <p className="text-sm text-muted-foreground">{formData.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                        <Check className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={sendVerificationEmail}
                        className="bg-white/10 border-white/20 hover:bg-white/20"
                        data-testid="button-verify-email"
                      >
                        Re-verify
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Phone Verification */}
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Phone Number</p>
                        <p className="text-sm text-muted-foreground">{formData.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={sendVerificationSMS}
                        className="bg-white/10 border-white/20 hover:bg-white/20"
                        data-testid="button-verify-phone"
                      >
                        Verify
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Picture */}
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Camera className="h-5 w-5 text-purple-500" />
                      <div>
                        <p className="font-medium">Profile Picture</p>
                        <p className="text-sm text-muted-foreground">Update your avatar</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="bg-white/10 border-white/20 hover:bg-white/20"
                      data-testid="button-update-avatar"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileManagementPanel;