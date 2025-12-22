import React from "react";
import GridCommonComponent from "@/components/grid/gridCommonComponent";
import { PaymentData } from "./payment";
import { paymentColumns } from "./column";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react"; // Import the search icon

const options = {
  select: true,
  order: false,
};

const page = () => {
  return (
    <div className="w-full">
      <div className="relative mb-2 w-[400px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input className="pl-10" placeholder="Search here..." />
      </div>
      <div className="">
        <GridCommonComponent
          data={PaymentData}
          options={options}
          columns={paymentColumns}
          theme={{
            border: "border-gray-300",
            header: {
              bg: "bg-gray-100",
            },
          }}
        />
      </div>
    </div>
  );
};
export default page;
