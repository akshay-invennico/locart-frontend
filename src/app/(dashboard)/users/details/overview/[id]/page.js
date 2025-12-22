"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchClientById } from "@/state/client/clientSlice";
import PortfolioCard from "@/components/common/PortfolioCard";
import { FaUser } from "react-icons/fa6";
import { FaScissors } from "react-icons/fa6";
import { FaCalendar } from "react-icons/fa6";
import Image from "next/image";
import ActionComponent from "@/components/grid/actionComponent";
import { columns } from "../column";
import Spinner from "@/components/common/Spinner";
import { useParams } from "next/navigation";

const ClientDetails = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { id: clientId } = useParams();

  const { client, summaryBoxes, loading } = useSelector(
    (state) => state.client
  );

  useEffect(() => {
    if (clientId) dispatch(fetchClientById(clientId));
  }, [clientId]);

  if (loading || !client) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Spinner />
      </div>
    );
  }

  const OverviewData = [
    {
      color: "bg-primary1",
      head: "Total Bookings",
      total: summaryBoxes?.find((s) => s.key === "totalBookings")?.value ?? 0,
      countIcon: "",
      upCount: "8.06",
      MainIcon: <FaUser size={20} color={"var(--color-primary1)"} />,
      description: "01 New Booking this month",
    },
    {
      color: "bg-secondary1",
      head: "Product Orders",
      total: summaryBoxes?.find((s) => s.key === "productOrders")?.value ?? 0,
      countIcon: "",
      upCount: "0.00",
      MainIcon: <FaScissors size={20} color={"var(--color-secondary1)"} />,
      description: "0 Product Orders this month",
    },
    {
      color: "bg-tertiary1",
      head: "Total Spent",
      total: summaryBoxes?.find((s) => s.key === "totalSpent")?.value ?? 0,
      countIcon: "8.06%",
      upCount: "8.06",
      MainIcon: <FaCalendar size={20} color={"var(--color-tertiary1)"} />,
      description: "$189 Spent this month",
    }
  ];

  const handleBack = () => router.back();

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-4">
        {/* Back arrow */}
        <div
          className="p-2 rounded-md hover:bg-gray-100 cursor-pointer"
          onClick={handleBack}
        >
          <Image
            src="/icons/backArrow.svg"
            alt="back button"
            width={20}
            height={20}
          />
        </div>

        {/* 3 dots (more options) */}
        <div className="cursor-pointer">
          <ActionComponent
            actions={columns[0].component.options.actions}
            columns={columns}
            data={client}
          />
        </div>
      </div>

      <div className="mb-4">
        <PortfolioCard data={OverviewData} />
      </div>

      <div className="border border-[#E4E4E6] rounded-lg p-6 bg-[#FFFFFF]">
        {/* header */}
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h2 className="text-lg font-semibold">Client Details</h2>
          <span className="flex items-center gap-2 text-sm rounded-md bg-green-50 text-green-500 border border-green-200 px-3 py-1">
            <span className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="text-xs font-medium">Client</span>
          </span>
        </div>

        {/* Profile */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="rounded-md mb-3">
            <Image
              src={client?.image || "/user.png"}
              alt={client.name}
              width={200}
              height={250}
              className="object-cover rounded"
            />
          </div>
          <h3 className="text-lg font-semibold">{client.name}</h3>
          <p className="text-gray-500 text-sm">{client.email}</p>
        </div>

        {/* Information of Client */}
        <div className="grid grid-cols-3  text-sm text-center py-4">
          <div>
            <p className="text-gray-500 mb-1">phone</p>
            <p className="font-medium">{client.phone || "N/A"}</p>
          </div>

          <div>
            <p className="text-gray-500 mb-1">Status</p>
            {client.status === "active" ? (
              <span className="bg-green-100 text-green-600 px-3 py-1 rounded-md text-xs font-medium">
                Active
              </span>
            ) : (
              <span className="bg-red-100 text-red-600 px-3 py-1 rounded-md text-xs font-medium">
                Suspended
              </span>
            )}
          </div>
          <div>
            <p className="text-gray-500 mb-1">joined locart</p>
            <p className="font-medium">{client.joinedOn?.split("T")[0]}</p>
          </div>
        </div>

        {/* Suspension Reason */}
        {client.suspensionReason && (
          <div className="mt-6 border rounded-md p-4 bg-gray-50 text-sm">
            <p className="text-gray-500 mb-1">Suspension Reason:</p>
            <p className="font-medium">{client.suspensionReason}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDetails;
