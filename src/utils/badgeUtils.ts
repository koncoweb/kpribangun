
import { BadgeProps } from "@/components/ui/badge";

/**
 * Returns the appropriate badge variant based on the family relationship
 */
export function getBadgeVariantByRelationship(hubungan: string): BadgeProps["variant"] {
  switch (hubungan) {
    case "Suami":
    case "Istri":
      return "info"; // Changed from "primary" to "info"
    case "Anak":
      return "default";
    case "Orang Tua":
      return "secondary";
    case "Saudara Kandung":
      return "outline";
    default:
      return "outline";
  }
}
