
import React from "react";

export interface FormHeaderProps {
  title: string;
}

export function FormHeader({ title }: FormHeaderProps) {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-muted-foreground text-sm">
        Silahkan lengkapi form di bawah ini untuk membuat pinjaman baru.
      </p>
    </div>
  );
}
