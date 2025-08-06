import { useState } from "react";
import { User as UserIcon, Settings, LogOut, Shield, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import ProfileCard from "@/components/ui/profile-card";
import UserProfileDialog from "@/components/ui/user-profile-dialog";
import { useAuth } from "@/hooks/useAuth";

const UserAvatar = () => {
  const { user, isAuthenticated } = useAuth();
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);

  if (!isAuthenticated || !user) {
    return null;
  }

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

  const getStatus = () => {
    const verificationCount = [user.isEmailVerified, user.isPhoneVerified]
      .filter(v => v === "true").length;
    
    if (verificationCount === 2) return "Verified";
    if (verificationCount === 1) return "Partially Verified";
    return "Unverified";
  };

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="relative h-10 w-10 rounded-full hover:bg-white/10"
            data-testid="user-avatar-trigger"
          >
            <Avatar className="h-10 w-10 border border-white/20">
              <AvatarImage 
                src={user.profileImageUrl || undefined} 
                alt={getFullName()}
                className="object-cover"
              />
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary-glow text-white font-semibold">
                {getInitials(user.firstName || undefined, user.lastName || undefined)}
              </AvatarFallback>
            </Avatar>
            {user.isEmailVerified === "true" && (
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
            )}
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-64 glass border-glass-border" align="end">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12 border border-white/20">
                  <AvatarImage 
                    src={user.profileImageUrl || undefined} 
                    alt={getFullName()}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary-glow text-white">
                    {getInitials(user.firstName || undefined, user.lastName || undefined)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold text-white">
                    {getFullName()}
                  </p>
                  <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                    {user.email}
                  </p>
                  <Badge 
                    variant={getStatus() === "Verified" ? "default" : "secondary"}
                    className="text-xs w-fit"
                  >
                    {getStatus()}
                  </Badge>
                </div>
              </div>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator className="bg-white/10" />
          
          <Dialog open={showProfileCard} onOpenChange={setShowProfileCard}>
            <DialogTrigger asChild>
              <DropdownMenuItem 
                onSelect={(e) => e.preventDefault()}
                className="cursor-pointer hover:bg-white/10"
                data-testid="profile-card-trigger"
              >
                <UserIcon className="mr-2 h-4 w-4" />
                View Profile Card
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-transparent border-none shadow-none">
              <div className="flex justify-center">
                <ProfileCard
                  name={getFullName()}
                  title={user.jobTitle || "Professional"}
                  handle={user.email?.split("@")[0] || "user"}
                  status={getStatus()}
                  avatarUrl={user.profileImageUrl || "/placeholder-avatar.jpg"}
                  miniAvatarUrl={user.profileImageUrl || "/placeholder-avatar.jpg"}
                  contactText="Edit Profile"
                  onContactClick={() => {
                    setShowProfileCard(false);
                    setShowProfileEdit(true);
                  }}
                  enableTilt={true}
                  enableMobileTilt={false}
                />
              </div>
            </DialogContent>
          </Dialog>

          <DropdownMenuItem 
            onClick={() => setShowProfileEdit(true)}
            className="cursor-pointer hover:bg-white/10"
            data-testid="edit-profile-trigger"
          >
            <Settings className="mr-2 h-4 w-4" />
            Edit Profile
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer hover:bg-white/10">
            <Shield className="mr-2 h-4 w-4" />
            Security Settings
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer hover:bg-white/10">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-white/10" />

          <DropdownMenuItem 
            onClick={handleLogout}
            className="cursor-pointer hover:bg-red-500/20 text-red-400"
            data-testid="logout-btn"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UserProfileDialog 
        open={showProfileEdit} 
        onOpenChange={setShowProfileEdit}
        user={user}
      />
    </>
  );
};

export default UserAvatar;