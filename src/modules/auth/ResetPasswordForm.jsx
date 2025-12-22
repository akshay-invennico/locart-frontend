"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { LuLock, LuEye, LuEyeOff } from "react-icons/lu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ResetPasswordForm = ({ onSubmit, onBack }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  return (
    <>
      <h3 className="font-semibold text-[#000000] mb-2 text-left text-xl sm:text-2xl md:text-3xl">
        Create a New Password
      </h3>
      <p className="text-[#7B7B7B] text-sm sm:text-base mb-6">
        Enter a strong new password to secure your admin access.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-4"
      >
        {/* Password */}
        <div className="flex flex-col gap-1">
          <Label
            htmlFor="password"
            className="text-sm font-medium text-[#000000]"
          >
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full pl-10 pr-4 py-3 h-12 border border-[#E4E4E6] rounded-md"
              {...register("password", { required: "Password is required" })}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
            />
            <LuLock
              size={20}
              className={`absolute top-1/2 left-3 -translate-y-1/2 ${
                passwordFocused ? "text-black" : "text-gray-400"
              }`}
            />
            {showPassword ? (
              <LuEyeOff
                size={20}
                className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <LuEye
                size={20}
                className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>
          <p className="text-red-500 text-xs min-h-[1rem]">
            {errors.password?.message}
          </p>
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1">
          <Label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-[#000000]"
          >
            Confirm Password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              className="w-full pl-10 pr-4 py-3 h-12 border border-[#E4E4E6] rounded-md"
              {...register("confirmPassword", {
                required: "Confirm Password is required",
              })}
              onFocus={() => setConfirmPasswordFocused(true)}
              onBlur={() => setConfirmPasswordFocused(false)}
            />
            <LuLock
              size={20}
              className={`absolute top-1/2 left-3 -translate-y-1/2 ${
                confirmPasswordFocused ? "text-black" : "text-gray-400"
              }`}
            />
            {showConfirmPassword ? (
              <LuEyeOff
                size={20}
                className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                onClick={() => setShowConfirmPassword(false)}
              />
            ) : (
              <LuEye
                size={20}
                className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                onClick={() => setShowConfirmPassword(true)}
              />
            )}
          </div>
          {password !== confirmPassword && (
            <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
          )}
        </div>

        <Button
          type="submit"
          className="bg-primary1 hover:bg-primary1/80 text-white h-12 rounded-md mt-2"
        >
          Reset Password
        </Button>
      </form>

      <div className="mt-6 w-full">
        <p className="text-center text-gray-500 text-xs leading-tight">
          Remember your password?{" "}
          <button
            className="text-primary1 cursor-pointer hover:text-teal-600 transition-colors"
            onClick={onBack}
          >
            Log in
          </button>
        </p>
      </div>
    </>
  );
};

export default ResetPasswordForm;
