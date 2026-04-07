import React, { useMemo } from "react";
import { Formik, Form, useFormikContext } from "formik";
import { FormInput, FormSelect } from "@/components/forms";
import ProductGrid from "../ProductGrid";

/* ── Static option lists ─────────────────────────────────── */

const COUNTRY_OPTIONS = [
  { value: "USA",          label: "🇺🇸 USA" },
  { value: "India",        label: "🇮🇳 India" },
  { value: "Germany",      label: "🇩🇪 Germany" },
  { value: "Poland",       label: "🇵🇱 Poland" },
  { value: "UK",           label: "🇬🇧 UK" },
  { value: "Saudi Arabia", label: "🇸🇦 Saudi Arabia" },
  { value: "UAE",          label: "🇦🇪 UAE" },
];

const PAYMENT_METHOD_OPTIONS = [
  { value: "Online", label: "Online" },
  { value: "Cash",   label: "Cash" },
];

const PAYMENT_STATUS_OPTIONS = [
  { value: "Paid",    label: "Paid" },
  { value: "Pending", label: "Pending" },
  { value: "Failed",  label: "Failed" },
];

const ORDER_STATUS_OPTIONS = [
  { value: "Pending",    label: "Pending" },
  { value: "Confirmed",  label: "Confirmed" },
  { value: "Delivered",  label: "Delivered" },
  { value: "Scheduled",  label: "Scheduled" },
  { value: "Cancelled",  label: "Cancelled" },
];

/* ── Products multi-select dropdown ─────────────────────── */

const PRODUCT_PLACEHOLDER = "Select Products";

const ProductSelectDropdown = ({ productOptions }) => {
  const { values, setFieldValue } = useFormikContext();
  const selected = Array.isArray(values.products) ? values.products : [];

  return (
    <FormSelect
      label="Select Products"
      name="products"
      options={productOptions}
      isMulti
      placeholder={PRODUCT_PLACEHOLDER}
      displayValue={
        selected.length
          ? selected
              .map((id) => productOptions.find((p) => p.value === id)?.label)
              .filter(Boolean)
              .join(", ")
          : undefined
      }
    />
  );
};

/* ── Selected products grid ──────────────────────────────── */

const SelectedProductsSection = ({ productOptions }) => {
  const { values, setFieldValue } = useFormikContext();
  const selectedIds = values.products || [];

  const resolvedProducts = useMemo(
    () =>
      selectedIds
        .map((id) => productOptions.find((p) => p.value === id))
        .filter(Boolean)
        .map((p) => ({
          value: p.value,
          label: p.label,
          icon: p.icon || "/placeholder.png",
          quantity: values[`${p.value}_qty`] || 1,
          price: p.price ?? 0,
        })),
    [selectedIds, productOptions, values]
  );

  if (!resolvedProducts.length) return null;

  return (
    <ProductGrid
      products={resolvedProducts}
      onQuantityChange={(id, qty) => setFieldValue(`${id}_qty`, qty)}
      onRemove={(id) =>
        setFieldValue(
          "products",
          selectedIds.filter((v) => v !== id)
        )
      }
    />
  );
};

/* ── Payable amount: auto-sum selected products ──────────── */

const PayableAmountField = ({ productOptions }) => {
  const { values } = useFormikContext();
  const selectedIds = values.products || [];

  const total = selectedIds.reduce((sum, id) => {
    const product = productOptions.find((p) => p.value === id);
    const qty = Number(values[`${id}_qty`] || 1);
    return sum + (product?.price ?? 0) * qty;
  }, 0);

  return (
    <FormInput
      label="Total Payable Amount"
      name="PayableAmount"
      placeholder="$0"
      disabled
      value={`$${total.toFixed(2)}`}
    />
  );
};

/* ── Initial values ──────────────────────────────────────── */

const initialValues = {
  name: "",
  email: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pin: "",
  country: "USA",
  products: [],
  PayableAmount: "",
  PaymentMethod: "",
  PaymentStatus: "",
  OrderStatus: "",
};

/* ── Section header ──────────────────────────────────────── */

const SectionHeader = ({ title }) => (
  <p className="text-base font-bold text-[#111111]">{title}</p>
);

/* ── Main form ───────────────────────────────────────────── */

const CreateInStoreOrderForm = ({ onSubmit, onCancel, productOptions = [] }) => {
  const handleSubmit = (values) => {
    const formData = { ...values };
    Object.keys(values).forEach((key) => {
      if (key.endsWith("_qty")) formData[key] = values[key];
    });
    onSubmit(formData);
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {() => (
        <Form className="flex flex-col gap-5">

          {/* ── Customer Details ── */}
          <SectionHeader title="Customer Details :" />

          {/* Row 1: Name | Email | Phone (Optional) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              label="Customer Name"
              name="name"
              placeholder="Customer Name"
            />
            <FormInput
              label="Email"
              name="email"
              type="email"
              placeholder="Email"
            />
            <FormInput
              label="Phone"
              label2="(Optional)"
              name="phone"
              placeholder="Phone"
            />
          </div>

          {/* Row 2: Address Line 1 | Address Line 2 (Optional) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Address Line 1"
              name="addressLine1"
              placeholder="Address line1"
            />
            <FormInput
              label="Address Line 2"
              label2="(Optional)"
              name="addressLine2"
              placeholder="Address line2"
            />
          </div>

          {/* Row 3: City | State | Pin | Country */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <FormInput label="City"  name="city"  placeholder="City"  />
            <FormInput label="State" name="state" placeholder="State" />
            <FormInput label="Pin"   name="pin"   placeholder="Pin"   />
            <FormSelect
              label="Country"
              name="country"
              options={COUNTRY_OPTIONS}
              placeholder="Select Country"
            />
          </div>

          {/* ── Product Details ── */}
          <SectionHeader title="Product Details :" />

          <ProductSelectDropdown productOptions={productOptions} />
          <SelectedProductsSection productOptions={productOptions} />

          {/* ── Payment Details ── */}
          <SectionHeader title="Payment Details :" />

          {/* Row 1: Total Payable Amount | Payment Method */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PayableAmountField productOptions={productOptions} />
            <FormSelect
              label="Payment Method"
              name="PaymentMethod"
              options={PAYMENT_METHOD_OPTIONS}
              placeholder="Select Payment Method"
            />
          </div>

          {/* Row 2: Payment Status | Order Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect
              label="Payment Status"
              name="PaymentStatus"
              options={PAYMENT_STATUS_OPTIONS}
              placeholder="Select Payment Method"
            />
            <FormSelect
              label="Order Status"
              name="OrderStatus"
              options={ORDER_STATUS_OPTIONS}
              placeholder="Select Payment Method"
            />
          </div>

          {/* ── Confirm Button ── */}
          <button
            type="submit"
            className="mt-2 w-full py-3 rounded-lg bg-[#02C8DE] hover:bg-[#01b5c9] text-white font-semibold text-sm transition-colors"
          >
            Confirm Order
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default CreateInStoreOrderForm;
