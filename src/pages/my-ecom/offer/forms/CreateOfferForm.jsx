import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  FormInput,
  FormTextarea,
  FormSelect,
  FormDateRangePicker,
  FormCheckboxGroup,
} from "@/components/forms";
import { Button } from "@/components/ui/button";

const offerSchema = Yup.object().shape({
  offerName: Yup.string().required("Offer name is required"),
  couponCode: Yup.string().required("Coupon code is required"),
  discount: Yup.number().required("Discount is required"),
  maxDiscount: Yup.number().required("Max discount is required"),
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
  { value: "Used", label: "Used" },
];

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
      {({ isSubmitting, values, setFieldValue }) => {
        // FormCheckboxGroup expects options to trigger update correctly
        return (
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

            <div className="grid grid-cols-2 gap-4">
              <FormInput
                name="discount"
                label="Discount (%)"
                placeholder="e.g. 8"
                type="number"
              />
              <FormInput
                name="maxDiscount"
                label="Max Discount Amount"
                placeholder="e.g. 99"
                type="number"
              />
            </div>

            <FormDateRangePicker name="dateRange" label="Date Range" />

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
                <label className="flex items-center gap-2 cursor-pointer w-fit">
                  <Field
                    type="radio"
                    name="offerCondition"
                    value="Product"
                    className="accent-[#02C8DE] w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">Product</span>
                </label>
                {values.offerCondition === "Product" && (
                  <div className="pl-6 max-h-[200px] overflow-y-auto border rounded-md p-3">
                    {productOptions.length > 0 ? (
                      <FormCheckboxGroup
                        label=""
                        name="selectedProducts"
                        options={productOptions}
                      />
                    ) : (
                      <p className="text-xs text-gray-500">No products available</p>
                    )}
                  </div>
                )}

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
                  <div className="pl-6 max-h-[200px] overflow-y-auto border rounded-md p-3">
                     {categoryOptions.length > 0 ? (
                      <FormCheckboxGroup
                        label=""
                        name="selectedCategories"
                        options={categoryOptions}
                      />
                    ) : (
                      <p className="text-xs text-gray-500">No categories available</p>
                    )}
                  </div>
                )}

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
        );
      }}
    </Formik>
  );
};

export default CreateOfferForm;
