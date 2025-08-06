import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Upload, Mail, Phone, Shield, Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { updateUserProfileSchema, User, UpdateUserProfile } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface UserProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
}

const UserProfileDialog = ({ open, onOpenChange, user }: UserProfileDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<UpdateUserProfile>({
    resolver: zodResolver(updateUserProfileSchema),
    defaultValues: {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      phoneNumber: user.phoneNumber || "",
      bio: user.bio || "",
      jobTitle: user.jobTitle || "",
      company: user.company || "",
      location: user.location || "",
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: UpdateUserProfile) => {
      return await apiRequest(`/api/users/${user.id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
        variant: "default",
      });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest(`/api/users/${user.id}/verify-email`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Verification Email Sent",
        description: "Please check your email for verification instructions.",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Verification Failed",
        description: error.message || "Failed to send verification email.",
        variant: "destructive",
      });
    },
  });

  const verifyPhoneMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest(`/api/users/${user.id}/verify-phone`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Verification SMS Sent",
        description: "Please check your phone for verification instructions.",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Verification Failed",
        description: error.message || "Failed to send verification SMS.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: UpdateUserProfile) => {
    updateProfileMutation.mutate(data);
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      await apiRequest(`/api/users/${user.id}/avatar`, {
        method: "POST",
        body: formData,
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Avatar Updated",
        description: "Your profile picture has been successfully updated.",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "U";
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  const getFullName = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.firstName) return user.firstName;
    if (user.lastName) return user.lastName;
    return user.email?.split("@")[0] || "User";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl glass border-glass-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Profile</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Update your profile information and manage your account settings.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20 border border-white/20">
              <AvatarImage 
                src={user.profileImageUrl || undefined} 
                alt={getFullName()}
                className="object-cover"
              />
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary-glow text-white text-2xl">
                {getInitials(user.firstName || undefined, user.lastName || undefined)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <div>
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  disabled={isUploading}
                />
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  disabled={isUploading}
                  className="border-white/20 hover:bg-white/10"
                >
                  <label htmlFor="avatar-upload" className="cursor-pointer">
                    {isUploading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4 mr-2" />
                    )}
                    {isUploading ? "Uploading..." : "Change Avatar"}
                  </label>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                JPG, PNG or GIF (Max 5MB)
              </p>
            </div>
          </div>

          <Separator className="bg-white/10" />

          {/* Verification Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Verification Status</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 rounded-lg glass border border-white/10">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="font-medium text-white">Email</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                {user.isEmailVerified === "true" ? (
                  <Badge variant="default" className="bg-green-500">
                    <Check className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => verifyEmailMutation.mutate()}
                    disabled={verifyEmailMutation.isPending}
                    className="border-white/20 hover:bg-white/10"
                  >
                    {verifyEmailMutation.isPending ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      "Verify"
                    )}
                  </Button>
                )}
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg glass border border-white/10">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-green-400" />
                  <div>
                    <p className="font-medium text-white">Phone</p>
                    <p className="text-sm text-muted-foreground">
                      {user.phoneNumber || "Not provided"}
                    </p>
                  </div>
                </div>
                {user.isPhoneVerified === "true" ? (
                  <Badge variant="default" className="bg-green-500">
                    <Check className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                ) : user.phoneNumber ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => verifyPhoneMutation.mutate()}
                    disabled={verifyPhoneMutation.isPending}
                    className="border-white/20 hover:bg-white/10"
                  >
                    {verifyPhoneMutation.isPending ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      "Verify"
                    )}
                  </Button>
                ) : (
                  <Badge variant="secondary">
                    <X className="w-3 h-3 mr-1" />
                    Not Set
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <Separator className="bg-white/10" />

          {/* Profile Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">First Name</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="glass border-white/20" 
                          data-testid="input-first-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Last Name</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="glass border-white/20" 
                          data-testid="input-last-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Phone Number</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="tel" 
                        className="glass border-white/20" 
                        placeholder="+1 (555) 000-0000"
                        data-testid="input-phone"
                      />
                    </FormControl>
                    <FormDescription className="text-muted-foreground">
                      Used for account verification and security alerts.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Job Title</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="glass border-white/20" 
                          placeholder="Software Engineer"
                          data-testid="input-job-title"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Company</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="glass border-white/20" 
                          placeholder="TechCorp Inc."
                          data-testid="input-company"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Location</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="glass border-white/20" 
                        placeholder="San Francisco, CA"
                        data-testid="input-location"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Bio</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        className="glass border-white/20 min-h-[100px]" 
                        placeholder="Tell us about yourself..."
                        data-testid="textarea-bio"
                      />
                    </FormControl>
                    <FormDescription className="text-muted-foreground">
                      Maximum 500 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="border-white/20 hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90 text-white"
                  data-testid="save-profile-btn"
                >
                  {updateProfileMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileDialog;