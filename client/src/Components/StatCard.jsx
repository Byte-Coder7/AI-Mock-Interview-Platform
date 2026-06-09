import React from "react";
import {
  BarChart3,
  FileText,
  Calendar,
  ClipboardList,
  Sparkles,
  Award,
  TrendingUp,
} from "lucide-react";

const colorMap = {
  blue: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    ring: "ring-blue-200",
    icon: "text-blue-600",
  },
  green: {
    bg: "bg-green-50",
    text: "text-green-700",
    ring: "ring-green-200",
    icon: "text-green-600",
  },
  purple: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    ring: "ring-purple-200",
    icon: "text-purple-600",
  },
  orange: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    ring: "ring-orange-200",
    icon: "text-orange-600",
  },
};

const defaultIcon = BarChart3;

const StatCard = ({ title, value, icon: IconProp, color = "blue" }) => {
  const colors = colorMap[color] || colorMap.blue;
  const Icon = IconProp || defaultIcon;

  return (
    <div
      className={[
        "group bg-white rounded-2xl shadow-sm border border-gray-100 p-6",
        "transition-transform duration-200 hover:-translate-y-1",
      ].join(" ")}
    >
      <div className="flex items-center gap-4">
        <div
          className={[
            "w-12 h-12 rounded-2xl flex items-center justify-center ring-1",
            colors.bg,
            colors.ring,
          ].join(" ")}
        >
          <Icon className={["w-6 h-6", colors.icon].join(" ")} />
        </div>

        <div className="min-w-0">
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900 leading-tight truncate">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
