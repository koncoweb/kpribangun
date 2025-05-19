import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/user";

/**
 * Result of a user registration operation
 */
export interface RegistrationResult {
  success: boolean;
  message?: string;
  user?: User;
  id?: string; // The UUID from auth.users
}

/**
 * Register a new user with Supabase Auth
 * This creates an entry in auth.users which triggers the database trigger
 * to create a corresponding entry in public.users
 */
export async function registerUser(
  email: string,
  password: string,
  userData?: {
    fullName?: string;
    username?: string;
  }
): Promise<RegistrationResult> {
  try {
    // Register the user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: userData?.fullName || '',
          username: userData?.username || '',
        },
      },
    });

    if (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message: error.message || "Failed to register user"
      };
    }

    if (!data.user) {
      return {
        success: false,
        message: "User registration failed - no user returned"
      };
    }

    // Return success with the user ID
    return {
      success: true,
      id: data.user.id
    };
  } catch (error: any) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: error.message || "Registration failed"
    };
  }
}
