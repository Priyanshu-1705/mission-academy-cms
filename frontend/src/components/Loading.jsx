import React from "react";

/**
 * A beautiful, standardized loading component that matches the design system.
 * Supports various sizes, colors/variants, layout styles, and optional text.
 * 
 * @param {Object} props
 * @param {"sm" | "md" | "lg" | "xl"} [props.size] - The size of the spinner
 * @param {"primary" | "white" | "gray"} [props.variant] - The color variant of the spinner
 * @param {string} [props.height] - Tailwind class for the outer container height (e.g. "h-48", "h-64", "h-screen")
 * @param {string} [props.text] - Optional loading message text
 * @param {string} [props.className] - Additional classes for the spinner itself
 * @param {string} [props.containerClassName] - Additional classes for the wrapping container
 */
export default function Loading({
  size = "md",
  variant = "primary",
  height = "h-48",
  text = "",
  className = "",
  containerClassName = "",
}) {
  // Size classes map
  const sizeClasses = {
    sm: "h-5 w-5 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-10 w-10 border-b-2",
    xl: "h-12 w-12 border-b-2",
  };

  // Color variant classes map
  const variantClasses = {
    primary: "border-school-primary",
    white: "border-white",
    gray: "border-gray-300",
  };

  const spinnerElement = (
    <div
      className={`animate-spin rounded-full ${sizeClasses[size] || sizeClasses.md} ${variantClasses[variant] || variantClasses.primary} ${className}`}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );

  // If height is empty or null, just return the spinner (for inline uses inside buttons etc.)
  if (!height) {
    return spinnerElement;
  }

  return (
    <div
      className={`flex flex-col justify-center items-center ${height} ${containerClassName}`}
    >
      {spinnerElement}
      {text && (
        <p className="text-gray-500 text-sm font-medium animate-pulse mt-4">
          {text}
        </p>
      )}
    </div>
  );
}
