export const orderSample = [
  {
    id: 1,
    user: {
      name: "John Doe",
      email: "john.doe@example.com",
      profile: `https://picsum.photos/512?random=${Math.floor(
        Math.random() * 100
      )}`,
      profile1: `https://picsum.photos/512?random=${Math.floor(
        Math.random() * 100
      )}`,
      profile2: `https://picsum.photos/512?random=${Math.floor(
        Math.random() * 100
      )}`,
      quantity: 5,
    },
    role: "admin",
    status: "active",
    joined_on: "2022-01-01T00:00:00.000Z",
    total_bookings: 10,
    total_spent: 1000,
    phone: "123-456-7890",
    order_items: [
      {
        icon: `https://picsum.photos/512?random=${Math.floor(
          Math.random() * 100
        )}`,
        name: "Product 1",
        price: 100,
        quantity: 1,
        total: 100,
        created_at: "2022-01-01T00:00:00.000Z",
        updated_at: "2022-01-01T00:00:00.000Z",
      },
      {
        icon: `https://picsum.photos/512?random=${Math.floor(
          Math.random() * 100
        )}`,
        name: "Product 2",
        price: 100,
        quantity: 1,
        total: 100,
        created_at: "2022-01-01T00:00:00.000Z",
        updated_at: "2022-01-01T00:00:00.000Z",
      },
      {
        icon: `https://picsum.photos/512?random=${Math.floor(
          Math.random() * 100
        )}`,
        name: "Product 3",
        price: 100,
        quantity: 1,
        total: 100,
        created_at: "2022-01-01T00:00:00.000Z",
        updated_at: "2022-01-01T00:00:00.000Z",
      },
      {
        icon: `https://picsum.photos/512?random=${Math.floor(
          Math.random() * 100
        )}`,
        name: "Product 4",
        price: 100,
        quantity: 1,
        total: 100,
        created_at: "2022-01-01T00:00:00.000Z",
        updated_at: "2022-01-01T00:00:00.000Z",
      },
      {
        icon: `https://picsum.photos/512?random=${Math.floor(
          Math.random() * 100
        )}`,
        name: "Product 5",
        price: 100,
        quantity: 1,
        total: 100,
        created_at: "2022-01-01T00:00:00.000Z",
        updated_at: "2022-01-01T00:00:00.000Z",
      },
    ],
    actions: [
      {
        id: 1,
        action: "View Profile",
        url: "/users/1",
      },
      {
        id: 2,
        action: "Edit Profile",
        url: "/users/1/edit",
      },
      {
        id: 3,
        action: "Delete Profile",
        url: "/users/1/delete",
      },
    ],
    created_at: "2022-01-01T00:00:00.000Z",
    updated_at: "2022-01-01T00:00:00.000Z",
  },
  {
    id: 2,
    user: {
      name: "Jane Doe",
      email: "jane.doe@example.com",
      profile: `https://picsum.photos/512?random=${Math.floor(
        Math.random() * 100
      )}`,
    },
    role: "user",
    status: "inactive",
    joined_on: "2022-01-01T00:00:00.000Z",
    total_bookings: 5,
    total_spent: 500,
    phone: "098-765-4321",
    order_items: [
      {
        icon: `https://picsum.photos/512?random=${Math.floor(
          Math.random() * 100
        )}`,
        name: "Product 1",
        price: 100,
        quantity: 1,
        total: 100,
        created_at: "2022-01-01T00:00:00.000Z",
        updated_at: "2022-01-01T00:00:00.000Z",
      },
      {
        icon: `https://picsum.photos/512?random=${Math.floor(
          Math.random() * 100
        )}`,
        name: "Product 2",
        price: 100,
        quantity: 1,
        total: 100,
        created_at: "2022-01-01T00:00:00.000Z",
        updated_at: "2022-01-01T00:00:00.000Z",
      },
    ],
    actions: [
      {
        id: 1,
        action: "View Profile",
        url: "/users/2",
      },
      {
        id: 2,
        action: "Edit Profile",
        url: "/users/2/edit",
      },
    ],
    created_at: "2022-01-01T00:00:00.000Z",
    updated_at: "2022-01-01T00:00:00.000Z",
  },
  {
    id: 3,
    user: {
      name: "Bob Smith",
      email: "bob.smith@example.com",
      profile: `https://picsum.photos/512?random=${Math.floor(
        Math.random() * 100
      )}`,
    },
    role: "admin",
    status: "active",
    joined_on: "2022-01-01T00:00:00.000Z",
    total_bookings: 15,
    total_spent: 1500,
    phone: "555-123-4567",
    order_items: [
      {
        icon: `https://picsum.photos/512?random=${Math.floor(
          Math.random() * 100
        )}`,
        name: "Product 1",
        price: 100,
        quantity: 1,
        total: 100,
        created_at: "2022-01-01T00:00:00.000Z",
        updated_at: "2022-01-01T00:00:00.000Z",
      },
    ],
    actions: [
      {
        id: 1,
        action: "View Profile",
        url: "/users/3",
      },
      {
        id: 2,
        action: "Edit Profile",
        url: "/users/3/edit",
      },
      {
        id: 3,
        action: "Delete Profile",
        url: "/users/3/delete",
      },
    ],
    created_at: "2022-01-01T00:00:00.000Z",
    updated_at: "2022-01-01T00:00:00.000Z",
  },
  {
    id: 4,
    user: {
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      profile: `https://picsum.photos/512?random=${Math.floor(
        Math.random() * 100
      )}`,
    },
    role: "user",
    status: "inactive",
    joined_on: "2022-01-01T00:00:00.000Z",
    total_bookings: 10,
    total_spent: 1000,
    phone: "555-555-5555",
    order_items: [
      {
        icon: `https://picsum.photos/512?random=${Math.floor(
          Math.random() * 100
        )}`,
        name: "Product 1",
        price: 100,
        quantity: 1,
        total: 100,
        created_at: "2022-01-01T00:00:00.000Z",
        updated_at: "2022-01-01T00:00:00.000Z",
      },
      {
        icon: `https://picsum.photos/512?random=${Math.floor(
          Math.random() * 100
        )}`,
        name: "Product 2",
        price: 100,
        quantity: 1,
        total: 100,
        created_at: "2022-01-01T00:00:00.000Z",
        updated_at: "2022-01-01T00:00:00.000Z",
      },
    ],
    actions: [
      {
        id: 1,
        action: "View Profile",
        url: "/users/4",
      },
      {
        id: 2,
        action: "Edit Profile",
        url: "/users/4/edit",
      },
    ],
    created_at: "2022-01-01T00:00:00.000Z",
    updated_at: "2022-01-01T00:00:00.000Z",
  },
  {
    id: 5,
    user: {
      name: "Mike Brown",
      email: "mike.brown@example.com",
      profile: `https://picsum.photos/512?random=${Math.floor(
        Math.random() * 100
      )}`,
    },
    role: "admin",
    status: "active",
    joined_on: "2022-01-01T00:00:00.000Z",
    total_bookings: 20,
    total_spent: 2000,
    phone: "555-555-5556",
    order_items: [
      {
        icon: `https://picsum.photos/512?random=${Math.floor(
          Math.random() * 100
        )}`,
        name: "Product 1",
        price: 100,
        quantity: 1,
        total: 100,
        created_at: "2022-01-01T00:00:00.000Z",
        updated_at: "2022-01-01T00:00:00.000Z",
      },
      {
        icon: `https://picsum.photos/512?random=${Math.floor(
          Math.random() * 100
        )}`,
        name: "Product 2",
        price: 100,
        quantity: 1,
        total: 100,
        created_at: "2022-01-01T00:00:00.000Z",
        updated_at: "2022-01-01T00:00:00.000Z",
      },
      {
        icon: `https://picsum.photos/512?random=${Math.floor(
          Math.random() * 100
        )}`,
        name: "Product 3",
        price: 100,
        quantity: 1,
        total: 100,
        created_at: "2022-01-01T00:00:00.000Z",
        updated_at: "2022-01-01T00:00:00.000Z",
      },
      {
        icon: `https://picsum.photos/512?random=${Math.floor(
          Math.random() * 100
        )}`,
        name: "Product 4",
        price: 100,
        quantity: 1,
        total: 100,
        created_at: "2022-01-01T00:00:00.000Z",
        updated_at: "2022-01-01T00:00:00.000Z",
      },
      {
        icon: `https://picsum.photos/512?random=${Math.floor(
          Math.random() * 100
        )}`,
        name: "Product 5",
        price: 100,
        quantity: 1,
        total: 100,
        created_at: "2022-01-01T00:00:00.000Z",
        updated_at: "2022-01-01T00:00:00.000Z",
      },
      {
        icon: `https://picsum.photos/512?random=${Math.floor(
          Math.random() * 100
        )}`,
        name: "Product 6",
        price: 100,
        quantity: 1,
        total: 100,
        created_at: "2022-01-01T00:00:00.000Z",
        updated_at: "2022-01-01T00:00:00.000Z",
      },
      {
        icon: `https://picsum.photos/512?random=${Math.floor(
          Math.random() * 100
        )}`,
        name: "Product 7",
        price: 100,
        quantity: 1,
        total: 100,
        created_at: "2022-01-01T00:00:00.000Z",
        updated_at: "2022-01-01T00:00:00.000Z",
      },
    ],
    actions: [
      {
        id: 1,
        action: "View Profile",
        url: "/users/5",
      },
      {
        id: 2,
        action: "Edit Profile",
        url: "/users/5/edit",
      },
      {
        id: 3,
        action: "Delete Profile",
        url: "/users/5/delete",
      },
    ],
    created_at: "2022-01-01T00:00:00.000Z",
    updated_at: "2022-01-01T00:00:00.000Z",
  },
];
