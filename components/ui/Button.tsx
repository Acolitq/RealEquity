import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
} from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  title,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  leftIcon,
  rightIcon,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles = "flex-row items-center justify-center rounded-xl";

  const variantStyles = {
    primary: "bg-primary active:bg-primary-dark",
    secondary: "bg-background-elevated active:bg-background-card",
    outline: "border-2 border-primary bg-transparent",
    ghost: "bg-transparent",
    danger: "bg-accent-red active:opacity-80",
  };

  const sizeStyles = {
    sm: "px-4 py-2",
    md: "px-6 py-3",
    lg: "px-8 py-4",
  };

  const textVariantStyles = {
    primary: "text-white",
    secondary: "text-white",
    outline: "text-primary",
    ghost: "text-primary",
    danger: "text-white",
  };

  const textSizeStyles = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const disabledStyles = disabled || isLoading ? "opacity-50" : "";

  return (
    <TouchableOpacity
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator
          color={variant === "outline" || variant === "ghost" ? "#4A90A4" : "#FFFFFF"}
          size="small"
        />
      ) : (
        <>
          {leftIcon && <>{leftIcon}</>}
          <Text
            className={`font-semibold ${textVariantStyles[variant]} ${textSizeStyles[size]} ${
              leftIcon ? "ml-2" : ""
            } ${rightIcon ? "mr-2" : ""}`}
          >
            {title}
          </Text>
          {rightIcon && <>{rightIcon}</>}
        </>
      )}
    </TouchableOpacity>
  );
}
