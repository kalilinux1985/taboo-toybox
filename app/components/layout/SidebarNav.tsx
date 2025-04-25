// app/components/layout/SidebarNav.tsx
'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export const SidebarNav = () => {
  return (
    <aside className="hidden md:block w-64 shrink-0 pr-6">
      <div className="sticky top-24 space-y-6">
        {/* User profile summary */}
        <div className="bg-gray-900/60 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src="https://readdy.ai/api/search-image?query=professional%20portrait%20photo%20of%20a%20person%20with%20stylish%20dark%20clothes%20against%20dark%20background&width=100&height=100&seq=avatar1&orientation=squarish" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">John Doe</h3>
              <p className="text-xs text-gray-400">@johndoe</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-sm">
            <div className="bg-gray-800/60 rounded-lg p-2">
              <div className="font-semibold">248</div>
              <div className="text-gray-400 text-xs">Following</div>
            </div>
            <div className="bg-gray-800/60 rounded-lg p-2">
              <div className="font-semibold">1.2K</div>
              <div className="text-gray-400 text-xs">Followers</div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="bg-gray-900/60 rounded-xl overflow-hidden">
          <ul>
            <li>
              <a href="../../feed/page" className="flex items-center gap-3 px-4 py-3 hover:bg-purple-900/30 text-white">
                <i className="fas fa-home w-5 text-center"></i>
                <span>Feed</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-purple-900/30 text-white">
                <i className="fas fa-store w-5 text-center"></i>
                <span>Marketplace</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-purple-900/30 text-white">
                <i className="fas fa-compass w-5 text-center"></i>
                <span>Explore</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-purple-900/30 text-white">
                <i className="fas fa-user w-5 text-center"></i>
                <span>Profile</span>
              </a>
            </li>
          </ul>
        </nav>

        {/* Categories */}
        <div className="bg-gray-900/60 rounded-xl p-4">
          <h3 className="font-medium mb-3">Categories</h3>
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-purple-900/30 !rounded-button cursor-pointer whitespace-nowrap">
              <i className="fas fa-tshirt mr-2"></i> Clothing
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-purple-900/30 !rounded-button cursor-pointer whitespace-nowrap">
              <i className="fas fa-shoe-prints mr-2"></i> Footwear
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-purple-900/30 !rounded-button cursor-pointer whitespace-nowrap">
              <i className="fas fa-gem mr-2"></i> Accessories
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-purple-900/30 !rounded-button cursor-pointer whitespace-nowrap">
              <i className="fas fa-gift mr-2"></i> Adult Toys
            </Button>
          </div>
        </div>

        {/* Logout Button */}
        <Button
          variant="outline"
          className="w-full border-gray-700 text-gray-300 hover:bg-purple-900/30 hover:text-white !rounded-button cursor-pointer whitespace-nowrap"
        >
          <i className="fas fa-sign-out-alt mr-2"></i> Logout
        </Button>
      </div>
    </aside>
  )
}
