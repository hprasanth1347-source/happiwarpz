import React from "react";
import { AlertCircle } from "lucide-react";

interface Props {
  message: string;
}

export default function ErrorMessage({ message }: Props) {
  return (
    <div className="flex items-start gap-3 p-4 bg-red-950/40 border border-brand-700/50 rounded-xl text-sm text-red-300">
      <AlertCircle className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
      <p>{message}</p>
    </div>
  );
}
