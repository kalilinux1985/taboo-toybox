// app/components/feed/ProductCard.tsx
'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface ProductCardProps {
  title: string
  price: number
  imageUrl: string
  condition: string
  size: string
  label?: string
  labelColor?: string
  sellerName: string
  sellerAvatar: string
}

export const ProductCard = ({
  title,
  price,
  imageUrl,
  size,
  condition,
  label,
  labelColor = "bg-pink-600",
  sellerName,
  sellerAvatar,
}: ProductCardProps) => {
  return (
    <Card className="bg-gray-900/60 border-gray-800 overflow-hidden group">
      {/* Image with badge */}
      <div className="aspect-square relative overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
        />
        {label && <Badge className={`absolute top-3 right-3 ${labelColor}`}>{label}</Badge>}
      </div>

      {/* Product Details */}
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium">{title}</h3>
          <p className="font-bold text-pink-500">{price}</p>
        </div>

        <div className="flex gap-2 mb-3">
          <Badge variant="outline" className="text-xs bg-gray-800/60 border-gray-700">
            Size {size}
          </Badge>
          <Badge variant="outline" className="text-xs bg-gray-800/60 border-gray-700">
            {condition}
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Avatar className="h-6 w-6">
            <AvatarImage src={sellerAvatar} />
            <AvatarFallback>{sellerName.charAt(0)}</AvatarFallback>
          </Avatar>
          <span>{sellerName}</span>
        </div>
      </CardContent>

      {/* CTA Buttons */}
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 !rounded-button cursor-pointer whitespace-nowrap">
          Buy Now
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="border-gray-700 text-gray-300 hover:bg-purple-900/30 hover:text-white !rounded-button cursor-pointer"
        >
          <i className="fas fa-heart" />
        </Button>
      </CardFooter>
    </Card>
  )
}

