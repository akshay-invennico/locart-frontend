"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import DynamicForm from "@/components/modules/DynamicFormRendering";
import { useDispatch } from "react-redux";
import {
  createOrder,
  fetchAllProducts,
} from "@/state/ecom/ecomSlice";

import { createInStoreOrderConfig } from "./createInStoreOrderConfig";
import { useSelector } from "react-redux";
import Spinner from "@/components/common/Spinner";
import { useCallback } from "react";
import { toast } from "sonner";


const CreateInStoreOrderPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { products } = useSelector((state) => state.ecomOrders);
  const [config, setConfig] = useState(null);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    dispatch(fetchAllProducts({}));
  }, [dispatch]);

  useEffect(() => {
    if (products.length > 0) {
      const productOptions = products.map((item) => ({
        value: item._id,
        label: item.productName,
        icon: item.imageUrls?.[0] ?? "/placeholder.png",
        price: Number(item.price),
      }));

      setConfig(createInStoreOrderConfig(productOptions));
    }
  }, [products]);

  const handleFormSubmit = (formData) => {
    const selectedProducts = formData?.products || [];
    if (!selectedProducts.length) {
      return;
    }

    const items = selectedProducts.map((productId) => {
      const product = products.find((p) => p._id === productId);
      const quantity = Number(formData[`${productId}_qty`] || 1);
      const rawPrice = product?.price?.$numberDecimal ?? product?.price;
      const price = Number(rawPrice || 0);
      const discount = 0;
      const amount = Number((price * quantity - discount).toFixed(2));

      return {
        description: product?.productName || product?.name || "Product",
        quantity,
        price,
        discount,
        amount,
      };
    });

    const subtotal = Number(
      items.reduce((sum, item) => sum + item.amount, 0).toFixed(2)
    );
    const tax = Number((subtotal * 0.08).toFixed(2));
    const total = Number((subtotal + tax).toFixed(2));

    const issueDate = new Date();
    const dueDate = new Date(issueDate.getTime() + 7 * 24 * 60 * 60 * 1000);

    const addressLine = [formData.addressLine1, formData.addressLine2]
      .filter(Boolean)
      .join(", ");
    const cityState = [formData.pin, formData.city, formData.state]
      .filter(Boolean)
      .join(" ");
  };

  const handleAddOrder = useCallback(
    async (formData) => {
      const normalizePaymentStatus = (status) => {
        const value = String(status || "").toLowerCase();
        if (value === "paid") return "paid";
        if (value === "pending") return "pending";
        if (value === "failed") return "failed";
        return "pending";
      };

      const normalizePaymentMethod = (method) => {
        const value = String(method || "").toLowerCase();
        if (value === "cash") return "cash";
        if (value === "online") return "online";
        return "online";
      };

      const normalizeOrderStatus = (status) => {
        const value = String(status || "").toLowerCase();
        if (
          [
            "pending",
            "dispatched",
            "confirmed",
            "shipped",
            "delivered",
            "cancelled",
            "returned",
          ].includes(value)
        ) {
          return value;
        }
        if (value === "scheduled") return "pending";
        return "pending";
      };

      const selectedProducts = formData.products || [];
      if (!selectedProducts.length) {
        toast.error("Please select at least one product.");
        return;
      }

      const payload = {
        customerType: "new",
        customerDetails: {
          name: formData.name || "",
          email: formData.email || "",
          phone: formData.phone || "",
          addressLine1: formData.addressLine1 || "",
          addressLine2: formData.addressLine2 || "",
          city: formData.city || "",
          state: formData.state || "",
          pin: formData.pin || "",
          country: Array.isArray(formData.country)
            ? formData.country[0] || ""
            : formData.country || "",
        },
        products: selectedProducts.map((productId) => ({
          productId,
          quantity: Number(formData[`${productId}_qty`] || 1),
        })),
        payment: {
          totalAmount: Number(formData.PayableAmount) || 0,
          paymentMethod: normalizePaymentMethod(formData.PaymentMethod),
          paymentStatus: normalizePaymentStatus(formData.PaymentStatus),
        },
        orderStatus: normalizeOrderStatus(formData.OrderStatus),
      };

      try {
        const res = await dispatch(createOrder(payload)).unwrap();
        toast.success(res?.message || "Order placed successfully");
        setFormKey((k) => k + 1);
      } catch (err) {
        toast.error(err?.message || "Failed to create order");
      }
    },
    [dispatch]
  );

  const handleBack = () => router.back();

  return (
    <div className="bg-white flex flex-col gap-4 ">
      {/* Back button */}
      <div className="flex items-center">
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
      </div>

      <div className="flex flex-col lg:flex-row gap-6 w-full ">
        <div className="w-full border rounded-md p-4 relative flex flex-col">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold mb-3">New In-Store Orders</h2>
          </div>

          {!config ? (
            <div className="text-center py-10 text-gray-400">
              <Spinner />
            </div>
          ) : (
            <DynamicForm
              key={formKey}
              config={config}
              onApply={async (formData) => {
                handleFormSubmit(formData);
                await handleAddOrder(formData);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateInStoreOrderPage;
