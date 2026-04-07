import { Outlet } from "react-router-dom";
import AuthSideImage from "@/components/common/AuthSideImage";

export default function AuthLayout() {
  return (
    <div className="h-screen w-full bg-white relative overflow-hidden">
      <div className="flex flex-col lg:flex-row h-full">
        <div className="w-full lg:w-[43%] flex flex-col justify-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-6 lg:py-0 max-h-screen">
          <Outlet />
        </div>

        <div className="hidden lg:flex lg:w-[57%] bg-gray-50">
          <AuthSideImage />
        </div>
      </div>

      <img
        src="/locart.svg"
        alt="logo"
        width={138}
        height={40}
        className="absolute top-14 left-14 hidden lg:block"
      />

      <img
        src="/locart.svg"
        alt="logo"
        width={138}
        height={40}
        className="absolute top-20 left-4 lg:hidden pl-4"
      />
    </div>
  );
}
