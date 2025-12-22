 "use client";
 import { columns } from "./column";
 import { badgedata } from "./badgedata";
 import GridCommonComponent from "@/components/grid/gridCommonComponent";
 
 export default function BadgeSection() {
   const options = {
     select: false,
     order: false,
     sortable: true,
   };
 
   return (
     <div className="w-full border rounded-lg p-4">
       <div className="mt-2">
         <h2 className="text-lg font-semibold mb-2">Badge & Achievement</h2>
         <GridCommonComponent
           data={badgedata}
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
 