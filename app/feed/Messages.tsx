// app/components/feed/Messages.tsx
'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"

export const Messages = () => {
  return (
    <Card className="bg-gray-900/60 border-gray-800">
      <div className="grid md:grid-cols-[300px_1fr] h-[600px]">
        {/* Sidebar – Chat List */}
        <div className="border-r border-gray-800">
          <div className="p-3 border-b border-gray-800 relative">
            <Input
              placeholder="Search messages..."
              className="bg-gray-800/60 border-gray-700 focus:border-purple-500 pl-10 text-sm"
            />
            <i className="fas fa-search absolute left-6 top-[27px] text-gray-500 text-sm" />
          </div>

          <ScrollArea className="h-[552px]">
            <div className="divide-y divide-gray-800">
              {/* Example Message Preview */}
              {["Sarah Miller", "Emma Wilson", "Mike Johnson"].map((name, index) => (
                <div
                  key={index}
                  className={`p-3 ${index === 1 ? "bg-purple-900/20 hover:bg-purple-900/30" : "hover:bg-gray-800/30"} cursor-pointer`}
                >
                  <div className="flex gap-3 items-center">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={`https://readdy.ai/api/search-image?seq=avatar${index + 2}&orientation=squarish`} />
                        <AvatarFallback>{name.match(/\b\w/g)?.join("")}</AvatarFallback>
                      </Avatar>
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h4 className="font-medium truncate">{name}</h4>
                        <span className="text-xs text-gray-400">{index === 0 ? "2m" : index === 1 ? "10m" : "1h"}</span>
                      </div>
                      <p className="text-sm text-gray-400 truncate">Hey! Are you interested in the leather jacket?</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Main Chat Window */}
        <div className="flex flex-col">
          {/* Chat Header */}
          <div className="p-3 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="https://readdy.ai/api/search-image?seq=avatar4&orientation=squarish" />
                <AvatarFallback>EW</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">Emma Wilson</h3>
                <p className="text-xs text-green-500">Online</p>
              </div>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="text-gray-400 !rounded-button">
                <i className="fas fa-phone" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 !rounded-button">
                <i className="fas fa-video" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 !rounded-button">
                <i className="fas fa-ellipsis-h" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4 space-y-4">
            <div className="flex gap-3 max-w-[80%]">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://readdy.ai/api/search-image?seq=avatar4&orientation=squarish" />
                <AvatarFallback>EW</AvatarFallback>
              </Avatar>
              <div>
                <div className="bg-gray-800 rounded-2xl rounded-tl-none p-3">
                  <p>Hi there! I just shipped your platform boots order.</p>
                </div>
                <p className="text-xs text-gray-400 mt-1">10:24 AM</p>
              </div>
            </div>

            <div className="flex flex-row-reverse gap-3 max-w-[80%] ml-auto">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://readdy.ai/api/search-image?seq=avatar1&orientation=squarish" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <div className="bg-purple-900/50 rounded-2xl rounded-tr-none p-3">
                  <p>Awesome, thank you so much!</p>
                </div>
                <p className="text-xs text-gray-400 mt-1 text-right">10:30 AM</p>
              </div>
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-3 border-t border-gray-800 relative">
            <Input
              placeholder="Type a message..."
              className="bg-gray-800/60 border-gray-700 focus:border-purple-500 pr-24 text-sm"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-purple-400 !rounded-button">
                <i className="fas fa-paperclip" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-purple-400 !rounded-button">
                <i className="fas fa-smile" />
              </Button>
              <Button
                size="icon"
                className="h-8 w-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 !rounded-button"
              >
                <i className="fas fa-paper-plane" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

