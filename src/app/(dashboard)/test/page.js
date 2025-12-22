import {
  GetStatusBadge,
  ProductRowProfile,
  UserRowProfile,
} from "@/lib/HelpFulFunction";
import React from "react";

const page = () => {
  return (
    <div>
      <UserRowProfile
        image="/locart.svg"
        name="Shahil"
        email="shahil@invennico.com"
      />
      <UserRowProfile name="Shahil" email="shahil@invennico.com" />
      <ProductRowProfile image="" productName="Aloe Locking Gel" />
      <UserRowProfile
        image="/locart.svg"
        name="Aaliyah Johnson completed a booking at Crown Culture, Atlanta"
        time="2 days ago"
      />
      <GetStatusBadge status="active" />
      <GetStatusBadge status="inactive" />
      <GetStatusBadge status="suspended" />
      <GetStatusBadge status="upcoming" />
      <GetStatusBadge status="completed" />
      <GetStatusBadge status="cancelled" />
      <GetStatusBadge status="pending" />
      <GetStatusBadge status="shipped" />
      <GetStatusBadge status="returned" />
      <GetStatusBadge status="delivered" />
      <GetStatusBadge status="paid" />
      <GetStatusBadge status="inprocess" />
      <GetStatusBadge status="expired" />
      <GetStatusBadge status="open" />
      <GetStatusBadge status="resolved" />
      <GetStatusBadge status="checking" />
    </div>
  );
};

export default page;
