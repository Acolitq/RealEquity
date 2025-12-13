import { View, ViewProps } from "react-native";

interface CardProps extends ViewProps {
  variant?: "default" | "elevated";
}

export function Card({
  variant = "default",
  className = "",
  children,
  ...props
}: CardProps) {
  const variantStyles = {
    default: "bg-background-card",
    elevated: "bg-background-elevated",
  };

  return (
    <View
      className={`rounded-2xl p-4 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </View>
  );
}
