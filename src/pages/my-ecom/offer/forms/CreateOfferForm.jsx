import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  FormInput,
  FormTextarea,
  FormSelect,
  FormDateRangePicker,
} from "@/components/forms";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const offerSchema = Yup.object().shape({
  offerName: Yup.string().required("Offer name is required"),
  couponCode: Yup.string().required("Coupon code is required"),
  discountType: Yup.string().oneOf(["percentage", "fixed"]).required("Discount type is required"),
  discount: Yup.number()
    .required("Discount is required")
    .when("discountType", {
      is: "percentage",
      then: (schema) => schema.min(0).max(100, "Percentage cannot exceed 100"),
    }),
  maxDiscount: Yup.number().when("discountType", {
    is: "percentage",
    then: (schema) => schema.required("Max discount is required"),
  }),
  status: Yup.string().required("Status is required"),
  offerCondition: Yup.string().required("Condition is required"),
  cartValue: Yup.number().when("offerCondition", {
    is: "Cart Value",
    then: () => Yup.number().required("Minimum cart value is required"),
  }),
});

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
  { value: "Expired", label: "Expired" },
];

const SelectedChips = ({ selected, options, onRemove }) => {
  if (!selected || selected.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {selected.map((val) => {
        const opt = options.find((o) => o.value === val);
        return (
          <span
            key={val}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm bg-[#02C8DE]/10 text-[#02C8DE] border border-[#02C8DE]/30"
          >
            {opt?.label || val}
            <button
              type="button"
              onClick={() => onRemove(val)}
              className="hover:bg-[#02C8DE]/20 rounded-full p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        );
      })}
    </div>
  );
};

const CreateOfferForm = ({
  initialValues,
  onSubmit,
  onCancel,
  isEdit = false,
  productOptions = [],
  categoryOptions = [],
}) => {
  const defaults = {
    offerName: "",
    couponCode: "",
    discountType: "percentage",
    discount: "",
    maxDiscount: "",
    dateRange: { from: null, to: null },
    status: "Active",
    offerCondition: "Product",
    selectedProducts: [],
    selectedCategories: [],
    cartValue: "",
    description: "",
    ...initialValues,
  };

  return (
    <Formik
      initialValues={defaults}
      validationSchema={offerSchema}
      enableReinitialize
      onSubmit={onSubmit}
    >
      {({ isSubmitting, values, setFieldValue }) => (
        <Form className="flex flex-col gap-5 pb-10">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {isEdit ? "Edit Offer" : "Create Offer"}
            </h3>
            <p className="text-sm text-gray-500 mb-3">
              {isEdit
                ? "Update complete offer information, pricing, status."
                : "Create a new offer by entering details below."}
            </p>
            <hr className="border-gray-200" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              name="offerName"
              label="Offer Name"
              placeholder="e.g. SUMMER SALE"
            />
            <FormInput
              name="couponCode"
              label="Coupon Code"
              placeholder="e.g. SUM20225"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-[#111111]">
              Discount Type
            </label>
            <div className="flex items-center gap-1 mb-3 bg-gray-100 rounded-lg p-1 w-fit">
              <button
                type="button"
                onClick={() => {
                  setFieldValue("discountType", "percentage");
                  setFieldValue("discount", "");
                  setFieldValue("maxDiscount", "");
                }}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  values.discountType === "percentage"
                    ? "bg-[#02C8DE] text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Percentage (%)
              </button>
              <button
                type="button"
                onClick={() => {
                  setFieldValue("discountType", "fixed");
                  setFieldValue("discount", "");
                  setFieldValue("maxDiscount", "");
                }}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  values.discountType === "fixed"
                    ? "bg-[#02C8DE] text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Fixed ($)
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormInput
                name="discount"
                label={values.discountType === "percentage" ? "Discount (%)" : "Discount Amount ($)"}
                placeholder={values.discountType === "percentage" ? "e.g. 8" : "e.g. 50"}
                type="number"
              />
              {values.discountType === "percentage" && (
                <FormInput
                  name="maxDiscount"
                  label="Max Discount Amount ($)"
                  placeholder="e.g. 99"
                  type="number"
                />
              )}
            </div>
          </div>

          <FormDateRangePicker nameFrom="dateRange.from" nameTo="dateRange.to" label="Date Range" />

          <FormSelect
            name="status"
            label="Offer Status"
            options={statusOptions}
          />

          <div>
            <label className="block text-sm font-medium mb-3 text-[#111111]">
              Offer Condition
            </label>
            <div className="space-y-4">
              {/* Products */}
              <label className="flex items-center gap-2 cursor-pointer w-fit">
                <Field
                  type="radio"
                  name="offerCondition"
                  value="Product"
                  className="accent-[#02C8DE] w-4 h-4"
                />
                <span className="text-sm text-gray-700">Products</span>
              </label>
              {values.offerCondition === "Product" && (
                <div className="pl-6">
                  <FormSelect
                    name="selectedProducts"
                    label="Select Products"
                    placeholder="Select Products"
                    options={productOptions}
                    isMulti
                  />
                  <SelectedChips
                    selected={values.selectedProducts}
                    options={productOptions}
                    onRemove={(val) =>
                      setFieldValue(
                        "selectedProducts",
                        values.selectedProducts.filter((v) => v !== val)
                      )
                    }
                  />
                </div>
              )}

              {/* Categories */}
              <label className="flex items-center gap-2 cursor-pointer w-fit">
                <Field
                  type="radio"
                  name="offerCondition"
                  value="Categories"
                  className="accent-[#02C8DE] w-4 h-4"
                />
                <span className="text-sm text-gray-700">Categories</span>
              </label>
              {values.offerCondition === "Categories" && (
                <div className="pl-6">
                  <FormSelect
                    name="selectedCategories"
                    label="Select Categories"
                    placeholder="Select Categories"
                    options={categoryOptions}
                    isMulti
                  />
                  <SelectedChips
                    selected={values.selectedCategories}
                    options={categoryOptions}
                    onRemove={(val) =>
                      setFieldValue(
                        "selectedCategories",
                        values.selectedCategories.filter((v) => v !== val)
                      )
                    }
                  />
                </div>
              )}

              {/* Cart Value */}
              <label className="flex items-center gap-2 cursor-pointer w-fit">
                <Field
                  type="radio"
                  name="offerCondition"
                  value="Cart Value"
                  className="accent-[#02C8DE] w-4 h-4"
                />
                <span className="text-sm text-gray-700">Cart Value</span>
              </label>
              {values.offerCondition === "Cart Value" && (
                <div className="pl-6">
                  <FormInput
                    name="cartValue"
                    label=""
                    placeholder="Enter Minimum Cart Value..."
                    type="number"
                  />
                </div>
              )}
            </div>
          </div>

          <FormTextarea
            name="description"
            label="Offer Description"
            placeholder="Enter description (Max 250 words)"
            rows={4}
          />

          <div className="flex gap-3 pt-4 border-t sticky bottom-0 bg-white py-2 z-10">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-[#02C8DE] text-[#02C8DE]"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#02C8DE] hover:bg-[#02C8DE]/90 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Processing..."
                : isEdit
                  ? "Update Offer"
                  : "Create Offer"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CreateOfferForm;
