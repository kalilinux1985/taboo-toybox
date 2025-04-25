'use client'

import { useAuth } from "@/lib/auth/AuthProvider"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const TopNav = () => {
  const { user, signOut } = useAuth()

  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-sm border-b border-purple-900/50 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Brand + Search */}
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Taboo Toybox
          </h1>

          <div className="relative hidden md:block w-64">
            <Input
              placeholder="Search..."
              className="bg-gray-900 border-gray-800 focus:border-purple-500 pl-10 text-sm"
            />
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"></i>
          </div>
        </div>

        {/* Right: Notifications + User */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative !rounded-button cursor-pointer">
            <i className="fas fa-bell text-gray-300"></i>
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-purple-500">
              3
            </Badge>
          </Button>

          <Button variant="ghost" size="icon" className="relative !rounded-button cursor-pointer">
            <i className="fas fa-envelope text-gray-300"></i>
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-pink-500">
              5
            </Badge>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 !rounded-button cursor-pointer whitespace-nowrap">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://readdy.ai/api/search-image?seq=avatar1&orientation=squarish" />
                  <AvatarFallback>{user?.email?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
                </Avatar>
                <span className="hidden md:inline">
                  {user?.email ?? "Guest"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800">
              <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Settings</DropdownMenuItem>
              {user && (
                <DropdownMenuItem
                  onClick={signOut}
                  className="cursor-pointer text-red-500"
                >
                  Logout
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
