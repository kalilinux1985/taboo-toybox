// app/components/feed/PostCard.tsx
'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

interface PostCardProps {
  userName: string
  userAvatar: string
  timePosted: string
  content: string
  mediaUrl?: string
  shopButton?: boolean
}

export const PostCard = ({
  userName,
  userAvatar,
  timePosted,
  content,
  mediaUrl,
  shopButton = false,
}: PostCardProps) => {
  return (
    <Card className="bg-gray-900/60 border-gray-800">
      {/* Header: Avatar + Name + Timestamp */}
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            <Avatar>
              <AvatarImage src={userAvatar} />
              <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{userName}</h3>
              <p className="text-xs text-gray-400">{timePosted}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 h-8 w-8 !rounded-button cursor-pointer"
          >
            <i className="fas fa-ellipsis-h" />
          </Button>
        </div>
      </CardHeader>

      {/* Content: Text + Media */}
      <CardContent className="pb-3">
        <p className="mb-4">{content}</p>
        {mediaUrl && (
          <div className="aspect-video rounded-lg overflow-hidden">
            <img
              src={mediaUrl}
              alt="Post media"
              className="w-full h-full object-cover object-top"
            />
          </div>
        )}
      </CardContent>

      {/* Footer: Actions */}
      <CardFooter className="flex justify-between pt-0">
        <div className="flex gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-purple-400 !rounded-button cursor-pointer whitespace-nowrap"
          >
            <i className="fas fa-heart mr-2" /> 128
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-purple-400 !rounded-button cursor-pointer whitespace-nowrap"
          >
            <i className="fas fa-comment mr-2" /> 32
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-purple-400 !rounded-button cursor-pointer whitespace-nowrap"
          >
            <i className="fas fa-share mr-2" /> Share
          </Button>
        </div>

        {shopButton && (
          <Button
            variant="outline"
            size="sm"
            className="border-purple-600 text-purple-400 hover:bg-purple-900/30 !rounded-button cursor-pointer whitespace-nowrap"
          >
            <i className="fas fa-shopping-cart mr-2" /> Shop Now
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

