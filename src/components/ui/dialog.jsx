"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

function Dialog({ children, ...props }) {
  return <DialogPrimitive.Root {...props}>{children}</DialogPrimitive.Root>;
}

function DialogTrigger({ ...props }) {
  return <DialogPrimitive.Trigger {...props} />;
}

function DialogContent({ className, children, ...props }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
      <DialogPrimitive.Content
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg rounded-lg",
          className
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4 text-gray-500 hover:text-gray-800">
          ✕
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

function DialogHeader({ className, ...props }) {
  return (
    <div
      className={cn("flex flex-col space-y-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}

function DialogTitle({ className, ...props }) {
  return (
    <DialogPrimitive.Title
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  );
}

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle };
