import { CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

interface StatusMessageProps {
  type: "success" | "error" | "info" | "warning";
  message: string;
  className?: string;
}

export const StatusMessage = ({ type, message, className = "" }: StatusMessageProps) => {
  const config = {
    success: {
      icon: CheckCircle,
      bgColor: "bg-green-50",
      textColor: "text-green-800",
      iconColor: "text-green-600"
    },
    error: {
      icon: AlertCircle,
      bgColor: "bg-red-50",
      textColor: "text-red-800", 
      iconColor: "text-red-600"
    },
    info: {
      icon: Info,
      bgColor: "bg-blue-50",
      textColor: "text-blue-800",
      iconColor: "text-blue-600"
    },
    warning: {
      icon: AlertTriangle,
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-800",
      iconColor: "text-yellow-600"
    }
  };

  const { icon: Icon, bgColor, textColor, iconColor } = config[type];

  return (
    <div className={`flex items-center gap-2 p-3 rounded-lg ${bgColor} ${className}`}>
      <Icon className={`w-5 h-5 ${iconColor}`} />
      <span className={`text-sm font-medium ${textColor}`}>{message}</span>
    </div>
  );
};