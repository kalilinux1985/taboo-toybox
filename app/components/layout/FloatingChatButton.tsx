// app/components/layout/FloatingChatButton.tsx
'use client'

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export const FloatingChatButton = () => {
  const [showChat, setShowChat] = useState(false)

  return (
    <Dialog open={showChat} onOpenChange={setShowChat}>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-20 right-4 md:bottom-6 md:right-6 h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg !rounded-button cursor-pointer"
          onClick={() => setShowChat(true)}
        >
          <i className="fas fa-comment-dots text-xl" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle>Messages</DialogTitle>
        </DialogHeader>

        <div className="max-h-[400px] overflow-y-auto divide-y divide-gray-800">
          {/* Example chat preview */}
          {[
            { name: "Sarah Miller", time: "2m" },
            { name: "Emma Wilson", time: "10m" },
            { name: "Mike Johnson", time: "1h" },
          ].map((msg, i) => (
            <div key={i} className="p-3 hover:bg-gray-800/30 cursor-pointer">
              <div className="flex gap-3 items-center">
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={`https://readdy.ai/api/search-image?seq=avatar${i + 2}&orientation=squarish`} />
                    <AvatarFallback>{msg.name.match(/\b\w/g)?.join("")}</AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-medium truncate">{msg.name}</h4>
                    <span className="text-xs text-gray-400">{msg.time}</span>
                  </div>
                  <p className="text-sm text-gray-400 truncate">
                    {i === 0
                      ? "Hey! Are you interested in the leather jacket?"
                      : i === 1
                      ? "I just shipped your order! Here's the tracking..."
                      : "Thanks for the purchase! Let me know if you have any questions."}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
