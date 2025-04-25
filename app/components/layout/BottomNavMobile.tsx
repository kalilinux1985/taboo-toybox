// app/components/layout/BottomNavMobile.tsx
'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export const BottomNavMobile = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-purple-900/50 px-4 py-2 z-50">
      <div className="flex justify-between items-center">
        {/* Home */}
        <Button variant="ghost" size="icon" className="text-gray-300 !rounded-button cursor-pointer">
          <i className="fas fa-home text-xl"></i>
        </Button>

        {/* Marketplace */}
        <Button variant="ghost" size="icon" className="text-gray-300 !rounded-button cursor-pointer">
          <i className="fas fa-store text-xl"></i>
        </Button>

        {/* Create Post */}
        <Button className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 !rounded-button cursor-pointer">
          <i className="fas fa-plus text-xl"></i>
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="text-gray-300 !rounded-button cursor-pointer">
          <i className="fas fa-bell text-xl"></i>
        </Button>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="!rounded-button cursor-pointer">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://readdy.ai/api/search-image?seq=avatar1&orientation=squarish" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800">
            <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">Settings</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-red-500">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}
