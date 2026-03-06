"use client";

import PopupForm from "@/components/ui/popupform";
import { reactivateClientConfig, suspendClientConfig } from "./config";

export const columns = (
  handleSuspendClient,
  handleReactivateClient,
) => [
    {
      key: "actions",
      title: "Actions",
      component: {
        type: "action",
        style: {},
        options: {
          actions: (row) => {
            const isSuspended = row?.status === "suspended";

            if (isSuspended) {
              return [
                {
                  label: "Reactivate Client",
                  iconUrl: "/icons/reactivateClient.svg",
                  type: "popUp",
                  component: (
                    <PopupForm
                      config={reactivateClientConfig}
                      width="500px"
                      onApply={() => {
                        if (handleReactivateClient) {
                          handleReactivateClient(row);
                        }
                      }}
                      onCancel={() => console.log("Cancelled")}
                    />
                  ),
                },
              ];
            }

            return [
              {
                label: "Suspend Client",
                iconUrl: "/icons/suspendClient.svg",
                type: "popUp",
                component: (
                  <PopupForm
                    config={suspendClientConfig}
                    width="500px"
                    onApply={(data) => {
                      if (handleSuspendClient) {
                        handleSuspendClient(data, row);
                      }
                    }}
                    onCancel={() => console.log("Cancelled")}
                  />
                ),
              },
            ];
          },
        },
      },
    },
  ];