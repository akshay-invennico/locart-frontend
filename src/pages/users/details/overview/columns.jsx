import SuspendClientForm from "@/pages/users/forms/SuspendClientForm";

export const columns = (handleSuspendClient, handleReactivateClient) => [
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
                type: "button",
                onClick: () => handleReactivateClient?.(row),
              },
            ];
          }

          return [
            {
              label: "Suspend Client",
              iconUrl: "/icons/suspendClient.svg",
              type: "popUp",
              component: (
                <SuspendClientForm
                  onSubmit={(values) => handleSuspendClient?.(values, row)}
                />
              ),
            },
          ];
        },
      },
    },
  },
];
