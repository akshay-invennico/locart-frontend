import PopupForm from "@/components/ui/popupform";
import { archiveClientConfig, reactivateClientConfig } from "./config";

export const columns = (handleSendResetPasswordLink) => [
  {
    key: "actions",
    title: "Actions",
    component: {
      type: "action",
      style: {},
      options: {
        actions: [
          {
            label: "Archive Client",
            iconUrl: "/icons/archiveClient.svg",
            type: "popUp",
            component: (
              <PopupForm
                config={archiveClientConfig}
                width="500px"
                height="500px"
                onApply={(data) => console.log("Archive applied:", data)}
                onCancel={() => console.log("Cancelled")}
              />
            ),
          },
          {
            label: "Reactivate Client",
            iconUrl: "/icons/reactivateClient.svg",
            type: "popUp",
            component: (
              <PopupForm
                config={reactivateClientConfig}
                width="500px"
                onApply={(data) => console.log("Reactivated:", data)}
                onCancel={() => console.log("Cancelled")}
              />
            ),
          },
          {
            label: "Share Reset Password Link",
            iconUrl: "/icons/lock.svg",
            type: "action",
            onClick: (row) => {
              if (handleSendResetPasswordLink) {
                handleSendResetPasswordLink(row);
              }
            },
          },
        ],
      },
    },
  },
]