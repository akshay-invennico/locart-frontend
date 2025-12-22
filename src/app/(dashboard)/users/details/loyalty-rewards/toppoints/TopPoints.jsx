 "use client";
 import { columns } from "./column";
 import { pointsdata } from "./pointsdata";
 import GridCommonComponent from "@/components/grid/gridCommonComponent";
 
 export default function TopPoints() {
   const options = {
     select: false,
     order: false,
     sortable: true,
   };
 
   return (
     <div className="w-full border rounded-lg p-4 mb-4">
       <div className="mt-2">
         <h2 className="text-lg font-semibold mb-2">Points Activity Table</h2>
         <GridCommonComponent
           data={pointsdata}
           columns={columns}
           options={options}
           theme={{
             border: "border-gray-300",
             header: { bg: "bg-gray-100" },
           }}
         />
       </div>
     </div>
   );
 }
 