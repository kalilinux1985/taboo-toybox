// app/components/feed/CreatePostCard.tsx
'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

export const CreatePostCard = () => {
  return (
    <Card className="bg-gray-900/60 border-gray-800">
      <CardHeader className="pb-3">
        <div className="flex gap-3">
          <Avatar>
            <AvatarImage src="https://readdy.ai/api/search-image?query=professional%20portrait%20photo%20of%20a%20person%20with%20stylish%20dark%20clothes%20against%20dark%20background&width=100&height=100&seq=avatar1&orientation=squarish" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <Textarea
            placeholder="What's on your mind?"
            className="bg-gray-800/60 border-gray-700 resize-none focus-visible:ring-purple-500"
          />
        </div>
      </CardHeader>

      <CardFooter className="flex justify-between pt-0">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-purple-400 !rounded-button cursor-pointer whitespace-nowrap"
          >
            <i className="fas fa-image mr-2"></i> Photo
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-purple-400 !rounded-button cursor-pointer whitespace-nowrap"
          >
            <i className="fas fa-video mr-2"></i> Video
          </Button>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 !rounded-button cursor-pointer whitespace-nowrap">
          Post
        </Button>
      </CardFooter>
    </Card>
  )
}

