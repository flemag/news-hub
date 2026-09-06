import {
  Cpu,
  Globe,
  Gamepad2,
  ShieldAlert,
  Landmark,
  Code2,
  Sparkles,
  Rocket,
  type LucideIcon,
} from "lucide-react";
import { Categorie } from "./types";

export const CATEGORY_ICON: Record<Categorie, LucideIcon> = {
  "IA": Cpu,
  "Web": Globe,
  "Gaming": Gamepad2,
  "Hack & Console": ShieldAlert,
  "Société & Politique": Landmark,
  "Dev": Code2,
  "Astuces": Sparkles,
  "Nouveautés": Rocket,
};
