export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      chats: {
        Row: {
          created_at: string
          id: string
          participant_ids: string[]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          participant_ids: string[]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          participant_ids?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          chat_id: string
          content: string
          created_at: string
          id: string
          sender_id: string
          timestamp: string
          updated_at: string
        }
        Insert: {
          chat_id: string
          content: string
          created_at?: string
          id?: string
          sender_id: string
          timestamp?: string
          updated_at?: string
        }
        Update: {
          chat_id?: string
          content?: string
          created_at?: string
          id?: string
          sender_id?: string
          timestamp?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          content: string
          created_at: string
          id: string
          media_url: string | null
          shop_button: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          media_url?: string | null
          shop_button?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          media_url?: string | null
          shop_button?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          created_at: string
          description: string
          free_shipping: boolean | null
          id: string
          image_url: string
          images: string[] | null
          original_price: number | null
          price: number
          rating: number | null
          review_count: number | null
          seller_id: string
          specifications: Json | null
          stock: number
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          free_shipping?: boolean | null
          id?: string
          image_url: string
          images?: string[] | null
          original_price?: number | null
          price: number
          rating?: number | null
          review_count?: number | null
          seller_id: string
          specifications?: Json | null
          stock: number
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          free_shipping?: boolean | null
          id?: string
          image_url?: string
          images?: string[] | null
          original_price?: number | null
          price?: number
          rating?: number | null
          review_count?: number | null
          seller_id?: string
          specifications?: Json | null
          stock?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          age: number | null
          avatar_url: string | null
          bio: string | null
          body_size: string | null
          country: string | null
          created_at: string
          email: string
          ethnicity: string | null
          gender: string | null
          id: string
          occupation: string | null
          private: boolean | null
          role: string
          shoe_size: string | null
          updated_at: string
          username: string
          what_i_offer: string | null
          will_show_face: boolean | null
        }
        Insert: {
          age?: number | null
          avatar_url?: string | null
          bio?: string | null
          body_size?: string | null
          country?: string | null
          created_at?: string
          email: string
          ethnicity?: string | null
          gender?: string | null
          id?: string
          occupation?: string | null
          private?: boolean | null
          role: string
          shoe_size?: string | null
          updated_at?: string
          username: string
          what_i_offer?: string | null
          will_show_face?: boolean | null
        }
        Update: {
          age?: number | null
          avatar_url?: string | null
          bio?: string | null
          body_size?: string | null
          country?: string | null
          created_at?: string
          email?: string
          ethnicity?: string | null
          gender?: string | null
          id?: string
          occupation?: string | null
          private?: boolean | null
          role?: string
          shoe_size?: string | null
          updated_at?: string
          username?: string
          what_i_offer?: string | null
          will_show_face?: boolean | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

// Add to the Tables section in the Database type
listings: {
  Row: {
    id: string;
    title: string;
    description: string;
    price: number;
    currency: string;
    images: string[];
    payment_methods: string[];
    category: string;
    seller_id: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    title: string;
    description: string;
    price: number;
    currency?: string;
    images: string[];
    payment_methods: string[];
    category: string;
    seller_id: string;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    title?: string;
    description?: string;
    price?: number;
    currency?: string;
    images?: string[];
    payment_methods?: string[];
    category?: string;
    seller_id?: string;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
  };
  Relationships: [
    {
      foreignKeyName: "listings_seller_id_fkey";
      columns: ["seller_id"];
      isOneToOne: false;
      referencedRelation: "users";
      referencedColumns: ["id"];
    }
  ];
};

saved_listings: {
  Row: {
    id: string;
    user_id: string;
    listing_id: string;
    created_at: string;
  };
  Insert: {
    id?: string;
    user_id: string;
    listing_id: string;
    created_at?: string;
  };
  Update: {
    id?: string;
    user_id?: string;
    listing_id?: string;
    created_at?: string;
  };
  Relationships: [
    {
      foreignKeyName: "saved_listings_listing_id_fkey";
      columns: ["listing_id"];
      isOneToOne: false;
      referencedRelation: "listings";
      referencedColumns: ["id"];
    },
    {
      foreignKeyName: "saved_listings_user_id_fkey";
      columns: ["user_id"];
      isOneToOne: false;
      referencedRelation: "users";
      referencedColumns: ["id"];
    }
  ];
};

listing_reviews: {
  Row: {
    id: string;
    listing_id: string;
    reviewer_id: string;
    rating: number;
    comment: string | null;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    listing_id: string;
    reviewer_id: string;
    rating: number;
    comment?: string | null;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    listing_id?: string;
    reviewer_id?: string;
    rating?: number;
    comment?: string | null;
    created_at?: string;
    updated_at?: string;
  };
  Relationships: [
    {
      foreignKeyName: "listing_reviews_listing_id_fkey";
      columns: ["listing_id"];
      isOneToOne: false;
      referencedRelation: "listings";
      referencedColumns: ["id"];
    },
    {
      foreignKeyName: "listing_reviews_reviewer_id_fkey";
      columns: ["reviewer_id"];
      isOneToOne: false;
      referencedRelation: "users";
      referencedColumns: ["id"];
    }
  ];
}

comments: {
  Row: {
    id: string;
    content: string
    post_id: string
    author_id: string
    author_name: string
    author_avatar: string | null
    created_at: string
  }
  Insert: {
    id?: string
    content: string
    post_id: string
    author_id: string
    author_name: string
    author_avatar?: string | null
    created_at?: string
  }
  Update: {
    id?: string
    content?: string
    post_id?: string
    author_id?: string
    author_name?: string
    author_avatar?: string | null
    created_at?: string
  }
  Relationships: [
    {
      foreignKeyName: "comments_post_id_fkey"
      columns: ["post_id"]
      isOneToOne: false
      referencedRelation: "posts"
      referencedColumns: ["id"]
    },
    {
      foreignKeyName: "comments_author_id_fkey"
      columns: ["author_id"]
      isOneToOne: false
      referencedRelation: "users"
      referencedColumns: ["id"]
    }
  ]
}
