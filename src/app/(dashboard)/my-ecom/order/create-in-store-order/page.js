"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import DynamicForm from "@/components/modules/DynamicFormRendering";
import DetailView from "@/components/modules/DetailView";
import ActionComponent from "@/components/grid/actionComponent";
import { useDispatch } from "react-redux";
import {
  createOrder,
  fetchAllOrders,
  fetchAllProducts,
} from "@/state/ecom/ecomSlice";

import { invoicePreviewConfig } from "./invoicePreviewConfig";
import { createInStoreOrderConfig } from "./createInStoreOrderConfig";
import { Download, Printer } from "lucide-react";
import { useSelector } from "react-redux";
import Spinner from "@/components/common/Spinner";
import { useCallback } from "react";
import { BsFilePdf, BsFileSpreadsheet } from "react-icons/bs";
import { exportGridCSV, exportGridPDF } from "@/lib/HelpFulFunction";
import { toast } from "sonner";


const CreateInStoreOrderPage = () => {


  const dispatch = useDispatch();
  const router = useRouter();
  const [invoiceData, setInvoiceData] = useState(null);

  const { products } = useSelector((state) => state.ecomOrders);
  const { orders, loading, selectedOrder, selectedOrderLoading } = useSelector(
    (state) => state.ecomOrders
  );
  const [config, setConfig] = useState(null);

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

  const handleCreateOrder = (data) => {
    dispatch(createOrder(data))
      .unwrap()
      .then(() => {
        dispatch(fetchAllOrders());
        dispatch(fetchAllProducts());
        router.push("/my-ecom/order");
      })
      .catch((err) => {
        console.error("Order create failed:", err);
      });
  };

  const handleFormSubmit = (formData) => {
    const hasProducts = formData?.products?.length > 0;
    if (hasProducts) {
      setInvoiceData({
        ...formData,
        invoiceDate: new Date().toLocaleDateString(),
        invoiceId: "#BK1023102456145258",
        taxes: 2,
        delivery: 0,
        discount: 20,
        total: 4602,
        payable: 4582,
      });
    } else {
      setInvoiceData(null);
    }
  };

  const handleAddOrder = useCallback(
    (formData) => {
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

        products: (formData.products || []).map((productId) => ({
          productId,
          quantity: Number(formData[`${productId}_qty`] || 1),
        })),

        payment: {
          totalAmount: Number(formData.PayableAmount) || 0,
          paymentMethod: formData.PaymentMethod?.[0]?.toLowerCase() || "online",
          paymentStatus:
            formData.PaymentStatus?.[0]?.toLowerCase() || "pending",
        },

        orderStatus: formData.OrderStatus?.[0]?.toLowerCase() || "scheduled",
      };

      dispatch(createOrder(payload));
    },
    [dispatch]
  );

  const handleBack = () => router.back();

    const downloadActions = [
    {
      header: "Download List",
    },
    {
      label: "Download PDF",
      icon: <BsFilePdf className="w-4 h-4 text-[#7B7B7B]" />,
      onClick: () => {
        exportGridPDF({
          rows: orders,
          columns: columns,
          filename: `orders.pdf`,
          title: "Orders Details",
        });
      },
    },
    {
      label: "Download CSV",
      icon: <BsFileSpreadsheet className="w-4 h-4  text-[#7B7B7B]" />,
      onClick: () => {
        exportGridCSV({
          rows: orders,
          columns: columns,
          filename: `orders.csv`,
        });
      },
    },
  ];

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
        <div className="w-full lg:w-[60%] border rounded-md p-4 relative flex flex-col">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold mb-3">New In-Store Orders</h2>
          </div>

          {!config ? (
            <div className="text-center py-10 text-gray-400">
              <Spinner />
            </div>
          ) : (
            <DynamicForm
              config={config}
              onApply={(formData) => {
                console.log("FORM SUBMITTED", formData);
                handleAddOrder(formData);
              }}

              // onChange={() => { }}
            />
          )}
        </div>

        <div className="w-full lg:w-[40%] border rounded-md p-4 relative flex flex-col max-h-[calc(100vh-200px)] overflow-hidden">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Invoice Preview</h2>

            <div className="flex items-center gap-2">
              <ActionComponent
                actions={downloadActions}
                icon={<Download className="w-4 h-4 text-[#02C8DE]" />}
                buttonClassName="flex items-center justify-center w-10 h-10 sm:w-auto sm:px-3 sm:py-2 border border-[var(--color-primary1)] bg-white rounded-md shadow-sm hover:bg-gray-50"
              />

              <button
                onClick={() => window.print()}
                className="flex items-center justify-center w-10 h-10 sm:w-auto sm:px-3 sm:py-2 border border-[var(--color-primary1)] bg-white rounded-md shadow-sm hover:bg-gray-50"
              >
                <Printer className="w-4 h-4 text-[#02C8DE]" />
              </button>
            </div>
          </div>

          {invoiceData ? (
            <DetailView config={invoicePreviewConfig} data={invoiceData} />
          ) : (
            <div className="flex  items-center justify-center text-gray-400">
              No data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateInStoreOrderPage;
