"use client";

import React, { useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchClientById } from "@/state/client/clientSlice";
import Image from "next/image";
import ActionComponent from "@/components/grid/actionComponent";
import { columns } from "../column";
import Spinner from "@/components/common/Spinner";
import { fallbackStats } from "./data";
import StatCard from "./StatCard";
import { HelpCircle } from "lucide-react";
import { sendForgotPassword } from "@/state/auth/authSlice";
import { toast } from "sonner";

const ClientDetails = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useParams();

  const clientId = Array.isArray(params?.id)
    ? params.id[0]
    : params?.id;

  const { client, loading, summaryBoxes } = useSelector(
    (state) => state.client
  );

  useEffect(() => {
    if (clientId) {
      dispatch(fetchClientById(clientId));
    }
  }, [clientId, dispatch]);

  const handleBack = () => router.back();

  const handleSendResetPasswordLink = (client) => {
    const email = client?.email;

    if (!email) {
      toast.error("Email not found for this client");
      return;
    }

    dispatch(sendForgotPassword(email))
      .unwrap()
      .then(() => {
        toast.success("Reset password link sent successfully");
      })
      .catch((err) => {
        console.error("Failed to send reset password link:", err);
        toast.error("Failed to send reset password link");
      });
  };

  // Memoize the columns with the handler
  const columnsWithHandler = useMemo(
    () => columns(handleSendResetPasswordLink),
    [handleSendResetPasswordLink]
  );

  const mappedStats = useMemo(() => {
    const safeSummaryBoxes = Array.isArray(summaryBoxes)
      ? summaryBoxes
      : [];

    if (safeSummaryBoxes.length === 0) {
      return Object.entries(fallbackStats).map(([key, fallback]) => ({
        id: key,
        title: fallback.title,
        value: fallback.value,
        subText: fallback.subText,
        bgColor: fallback.bgColor,
        icon: fallback.icon || HelpCircle,
      }));
    }

    return safeSummaryBoxes.map((box) => {
      const fallback = fallbackStats[box.key] || {};

      return {
        id: box.key,
        title: fallback.title || box.key,
        value:
          box?.value !== undefined && box?.value !== null
            ? box.value
            : fallback.value ?? 0,
        subText: box?.message || fallback.subText || "",
        bgColor: fallback.bgColor || "bg-gray-400",
        icon: fallback.icon || HelpCircle,
      };
    });
  }, [summaryBoxes]);

  if (loading || !client) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-4">
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

        <div className="cursor-pointer">
          <ActionComponent
            actions={columnsWithHandler[0].component.options.actions}
            columns={columnsWithHandler}
            data={client}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {mappedStats.map((card) => (
          <StatCard key={card.id} data={card} icon={card.icon} />
        ))}
      </div>

      <div className="border border-[#E4E4E6] rounded-lg p-6 bg-white">
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h2 className="text-lg font-semibold">Client Details</h2>
          <span className="flex items-center gap-2 text-sm rounded-md bg-green-50 text-green-500 border border-green-200 px-3 py-1">
            <span className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="text-xs font-medium">Client</span>
          </span>
        </div>

        <div className="flex flex-col items-center text-center mb-6">
          <Image
            src={client?.image || "/user.png"}
            alt={client.name}
            width={200}
            height={250}
            className="object-cover rounded mb-3"
          />
          <h3 className="text-lg font-semibold">{client.name}</h3>
          <p className="text-gray-500 text-sm">{client.email}</p>
        </div>

        <div className="grid grid-cols-3 text-sm text-center py-4">
          <div>
            <p className="text-gray-500 mb-1">Phone</p>
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
            <p className="text-gray-500 mb-1">Joined Locart</p>
            <p className="font-medium">
              {client.joinedOn?.split("T")[0] || "—"}
            </p>
          </div>
        </div>

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