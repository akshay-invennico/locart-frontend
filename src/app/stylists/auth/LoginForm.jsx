"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CiMail } from "react-icons/ci";
import { LuLock, LuEye, LuEyeOff } from "react-icons/lu";
import { useSelector } from "react-redux";
const LoginForm = ({
  register,
  errors,
  showPassword,
  setShowPassword,
  emailFocused,
  setEmailFocused,
  passwordFocused,
  setPasswordFocused,
  handleSubmit,
  handleLogin,
  setCurrentView,
}) => {
  const user = useSelector((state) => state?.auth?.user);
  // const role = user?.role; // optional chaining
  return (
    <>
      <h3 className="font-semibold text-[#000000] mb-2 whitespace-nowrap text-left text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
        Welcome Back, Master Of Styles
      </h3>
      <p className="text-[#7B7B7B] text-xs sm:text-sm md:text-base text-left leading-relaxed mb-6">
        Access the tools that keep chairs filled, stylists on point, and shelves
        stocked with the best in loc care.
      </p>

      <form
        onSubmit={handleSubmit(handleLogin)}
        className="w-full flex flex-col gap-2"
      >
        {/* Email */}
        <div className="flex flex-col gap-1">
          <Label
            htmlFor="email"
            className="text-xs sm:text-sm font-medium text-[#000000]"
          >
            Email
          </Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 h-10 sm:h-12 placeholder:text-placeholder-color border ${
                errors.email ? "border-red-500" : "border-[#E4E4E6]"
              } rounded text-sm sm:text-base`}
              {...register("email", { required: "Email is required" })}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
            />
            <CiMail
              size={18}
              className={`absolute top-1/2 left-3 -translate-y-1/2 ${
                emailFocused ? "text-black" : "text-gray-500"
              }`}
            />
          </div>
          <p className="text-red-500 text-xs min-h-[1rem]">
            {errors.email?.message}
          </p>
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <Label
            htmlFor="password"
            className="text-xs sm:text-sm font-medium text-[#000000]"
          >
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className={`w-full pl-9 sm:pl-10 pr-9 sm:pr-10 py-1.5 sm:py-2 h-10 sm:h-12 placeholder:text-placeholder-color border ${
                errors.password ? "border-red-500" : "border-[#E4E4E6]"
              } rounded text-sm sm:text-base`}
              {...register("password", { required: "Password is required" })}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
            />
            <LuLock
              size={18}
              className={`absolute top-1/2 left-3 -translate-y-1/2 ${
                passwordFocused ? "text-black" : "text-gray-400"
              }`}
            />
            {showPassword ? (
              <LuEyeOff
                size={18}
                onClick={() => setShowPassword(false)}
                className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-400"
              />
            ) : (
              <LuEye
                size={18}
                onClick={() => setShowPassword(true)}
                className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-400"
              />
            )}
          </div>
          <p className="text-red-500 text-xs min-h-[1rem]">
            {errors.password?.message}
          </p>
        </div>

        <div className="flex items-center justify-between text-xs sm:text-sm flex-wrap gap-2">
          <div className="flex items-center gap-1 sm:gap-2">
            {/* <Checkbox id="rememberMe" /> */}
            <Checkbox
              id="rememberMe"
              defaultChecked
              className=" rounded border-gray-300 checked:bg-[#02C8DE] checked:border-[#02C8DE] 
               checked:text-white text-gray-400 "
            />
            <label
              htmlFor="rememberMe"
              className="text-gray-500 whitespace-nowrap"
            >
              Keep me logged in
            </label>
          </div>
          <button
            type="button"
            className="text-gray-500 whitespace-nowrap"
            onClick={() => setCurrentView("forgot-password")}
          >
            Forgot Password?
          </button>
        </div>

        <Button
          type="submit"
          className="bg-primary1 hover:bg-primary1/80 text-white h-12 rounded-md mt-2"
        >
          Login
        </Button>
      </form>

      <div className="mt-14 w-full">
        <p className="text-center text-gray-400 text-xs leading-tight">
          This panel is reserved for verified LocArt Admins.
        </p>
      </div>
    </>
  );
};

export default LoginForm;
