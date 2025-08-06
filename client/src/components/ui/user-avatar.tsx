import { useState } from "react";
import { User, Settings, LogOut, Shield, Camera } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import ProfileCard from "./profile-card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function UserAvatar() {
  const { user, isLoading } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
    );
  }

  if (!user) {
    return null;
  }

  const userInitials = user.firstName && user.lastName 
    ? `${user.firstName[0]}${user.lastName[0]}`
    : user.email?.[0]?.toUpperCase() || "U";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button 
            className="relative h-8 w-8 rounded-full ring-2 ring-white/10 hover:ring-white/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
            data-testid="user-avatar-trigger"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage 
                src={user.profileImageUrl || undefined} 
                alt={user.firstName ? `${user.firstName} ${user.lastName}` : "User avatar"} 
              />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-xs font-semibold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          align="end" 
          className="w-56 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-white/20 dark:border-gray-800/50"
          data-testid="user-dropdown-menu"
        >
          <DropdownMenuLabel className="font-medium">
            <div className="flex flex-col space-y-1">
              <span data-testid="user-name">
                {user.firstName || user.lastName 
                  ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                  : "User"
                }
              </span>
              <span className="text-xs text-muted-foreground" data-testid="user-email">
                {user.email}
              </span>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator className="bg-white/20 dark:bg-gray-800/50" />
          
          <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
            <DialogTrigger asChild>
              <DropdownMenuItem 
                onSelect={(e) => e.preventDefault()}
                className="cursor-pointer"
                data-testid="menu-view-profile"
              >
                <User className="mr-2 h-4 w-4" />
                <span>View Profile</span>
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="max-w-4xl p-0 bg-transparent border-none shadow-none">
              <ProfileCard 
                avatarUrl={user.profileImageUrl || ""}
                name={user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : "User"}
                title={user.jobTitle || "Professional"}
                handle={user.email?.split('@')[0] || "user"}
                status="Online"
                contactText="Edit Profile"
                onContactClick={() => setIsProfileOpen(false)}
                showUserInfo={true}
                enableTilt={true}
              />
            </DialogContent>
          </Dialog>

          <DropdownMenuItem data-testid="menu-settings">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem data-testid="menu-privacy">
            <Shield className="mr-2 h-4 w-4" />
            <span>Privacy & Security</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="bg-white/20 dark:bg-gray-800/50" />
          
          <DropdownMenuItem 
            className="text-red-600 dark:text-red-400 cursor-pointer"
            onClick={() => window.location.href = '/api/logout'}
            data-testid="menu-logout"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}