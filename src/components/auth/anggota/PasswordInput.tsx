
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { ControllerRenderProps } from "react-hook-form";

// Props for usage as a standalone component
export interface PasswordInputProps {
  value?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  name: string;
  id?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  ref?: React.Ref<HTMLInputElement>;
  min?: string | number;
  max?: string | number;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
}

// Props for usage with react-hook-form field
export interface PasswordInputFieldProps {
  field: ControllerRenderProps<any, any>;
}

export function PasswordInput(props: PasswordInputProps | PasswordInputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  // Handle both standard props and react-hook-form field prop
  const isFieldProp = 'field' in props;
  
  // Extract input props based on the prop type
  const inputProps = isFieldProp 
    ? props.field 
    : props;

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        {...inputProps}
        placeholder={isFieldProp ? "Enter password" : (props as PasswordInputProps).placeholder || "Enter password"}
        className={isFieldProp ? "" : (props as PasswordInputProps).className || ""}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
        onClick={() => setShowPassword(!showPassword)}
        tabIndex={-1}
      >
        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
      </Button>
    </div>
  );
}
