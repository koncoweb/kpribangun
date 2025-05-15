
import { z } from "zod";
import { adminLoginFormSchema } from "./formSchema";

export type FormData = z.infer<typeof adminLoginFormSchema>;

export interface LoginFormProps {
  title?: string;
  subtitle?: string;
  demoCredentials?: Array<{
    label: string;
    username: string;
    password: string;
  }>;
  onSuccessRedirect?: string;
}
