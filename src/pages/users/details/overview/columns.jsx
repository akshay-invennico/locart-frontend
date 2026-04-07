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
                type: "popUp",
                onAction: () => handleReactivateClient?.(row),
              },
            ];
          }

          return [
            {
              label: "Suspend Client",
              iconUrl: "/icons/suspendClient.svg",
              type: "popUp",
              onAction: (data) => handleSuspendClient?.(data, row),
            },
          ];
        },
      },
    },
  },
];
