import { 
  SiInstagram, 
  SiFacebook, 
  SiX, 
  SiPinterest, 
  SiLinkedin, 
  SiYoutube, 
  SiTiktok 
} from "react-icons/si";
import { ShoppingBag } from "lucide-react";

export const PLATFORMS = [
  {
    id: "instagram",
    name: "Instagram",
    icon: SiInstagram,
    color: "from-purple-600 to-pink-500",
    bgColor: "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: SiFacebook,
    color: "from-blue-600 to-blue-700",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    id: "twitter",
    name: "X (Twitter)",
    icon: SiX,
    color: "from-gray-900 to-gray-800",
    bgColor: "bg-gray-50 dark:bg-gray-900/30",
  },
  {
    id: "pinterest",
    name: "Pinterest",
    icon: SiPinterest,
    color: "from-red-600 to-red-700",
    bgColor: "bg-red-50 dark:bg-red-950/30",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: SiLinkedin,
    color: "from-blue-700 to-blue-800",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: SiYoutube,
    color: "from-red-600 to-red-700",
    bgColor: "bg-red-50 dark:bg-red-950/30",
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: SiTiktok,
    color: "from-gray-900 to-pink-500",
    bgColor: "bg-gradient-to-br from-gray-50 to-pink-50 dark:from-gray-950/30 dark:to-pink-950/30",
  },
  {
    id: "etsy",
    name: "Etsy",
    icon: ShoppingBag,
    color: "from-orange-600 to-orange-700",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
  },
] as const;

export type PlatformId = typeof PLATFORMS[number]['id'];

export const getPlatformById = (id: string) => {
  return PLATFORMS.find(p => p.id === id);
};
