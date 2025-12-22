import Image from "next/image";
import React from "react";

const AuthSideImage = () => {
  return (
    // <div className="relative w-full h-full bg-gradient-to-t from-gradient1  via-gradient2 via-gradient3 via-gradient4 via-gradient4 to-gradient6">
    <div className="relative w-full h-full bg-secondary1">
      <div className="absolute top-10 left-10 right-10 bottom-10 max-w-3xl  h-[146px] flex flex-col gap-4">
        <h2 className="text-[37px] font-bold text-white">
          Powering Every Twist, Turn, and Transaction
        </h2>
        <p className="text-[22px] text-white font-medium">
          From bookings to products — LocArt Admins make the artistry flow.
        </p>
      </div>
      <div className="absolute justify-center left-0 bottom-0 w-full text-center flex flex-col gap-4">
      <Image
            src="/auth_banner.webp"
            alt="logo"
            width={1000}
            height={1000}
            className="w-[100%]"
            priority
          />
      </div>
    </div>
  );
};

export default AuthSideImage;
