"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { CiMail } from "react-icons/ci";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ForgotPasswordForm = ({ onSubmit, onBack }) => {
  const [emailFocused, setEmailFocused] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <>
      <h3 className="font-semibold text-[#000000] mb-2 whitespace-nowrap text-left text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
        Forgot Your Password?
      </h3>
      <p className="text-[#7B7B7B] text-xs sm:text-sm md:text-base leading-relaxed mb-6">
        Enter your email to reset your password and regain access to your account.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-4"
      >
        <div className="flex flex-col gap-1">
          <Label
            htmlFor="email"
            className="text-sm font-medium text-[#000000]"
          >
            Email
          </Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="w-full pl-10 pr-4 py-3 h-12 border border-[#E4E4E6] rounded-md text-sm sm:text-base"
              {...register("email", { required: "Email is required" })}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
            />
            <CiMail
              size={20}
              className={`absolute top-1/2 left-3 -translate-y-1/2 ${
                emailFocused ? "text-teal-500" : "text-gray-400"
              }`}
            />
          </div>
          <p className="text-red-500 text-xs min-h-[1rem]">
            {errors.email?.message}
          </p>
        </div>
        <Button
          type="submit"
          className="w-full bg-primary1 hover:bg-primary1/80 text-white h-12 rounded-md font-medium transition-colors shadow-sm mt-2"
        >
          Continue
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

export default ForgotPasswordForm;
