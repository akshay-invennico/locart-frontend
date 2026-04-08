import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  createOrder,
  fetchAllProducts,
} from "@/state/ecom/ecomSlice";
import Spinner from "@/components/common/Spinner";
import { toast } from "sonner";
import CreateInStoreOrderForm from "./forms/CreateInStoreOrderForm";

const CreateInStoreOrderPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products } = useSelector((state) => state.ecomOrders);
  const [productOptions, setProductOptions] = useState(null);

  useEffect(() => {
    dispatch(fetchAllProducts({}));
  }, [dispatch]);

  useEffect(() => {
    if (products && products.length > 0) {
      const options = products.map((item) => ({
        value: item._id,
        label: item.productName || item.name,
        icon: item.imageUrls?.[0] ?? "/placeholder.png",
        price: Number(item.price?.$numberDecimal || item.price || 0),
      }));
      setProductOptions(options);
    } else if (products && products.length === 0) {
      setProductOptions([]);
    }
  }, [products]);

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
        navigate(-1);
      } catch (err) {
        toast.error(err?.message || "Failed to create order");
      }
    },
    [dispatch, navigate]
  );

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/my-ecom/order", { replace: true });
    }
  };

  return (
    <div className="bg-white flex flex-col gap-4">
      {/* Back button */}
      <div className="flex items-center">
        <div
          className="p-2 rounded-md hover:bg-gray-100 cursor-pointer"
          onClick={handleBack}
        >
          <img src="/icons/backArrow.svg" alt="back button" width={20} height={20} />
        </div>
      </div>

      <div className="w-full border border-gray-200 rounded-xl p-6 flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-[#111111]">New In-Store Order</h2>

        <hr className="border-gray-200" />

        {!productOptions ? (
          <div className="text-center py-10 text-gray-400">
            <Spinner />
          </div>
        ) : (
          <CreateInStoreOrderForm
            onSubmit={handleAddOrder}
            onCancel={handleBack}
            productOptions={productOptions}
          />
        )}
      </div>
    </div>
  );
};

export default CreateInStoreOrderPage;
