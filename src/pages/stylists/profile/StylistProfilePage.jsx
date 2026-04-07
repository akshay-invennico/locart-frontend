import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { FormInput, FormTextarea, FormFileUpload } from "@/components/forms";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  getMyStylistProfile,
  updateMyStylistProfile,
} from "@/state/stylist/stylistMeService";
import { AlertCircle } from "lucide-react";
import { useStylistApi } from "../_shared/useStylistApi";

const schema = Yup.object({
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
});

const StylistProfilePage = () => {
  const { data, loading, error, run } = useStylistApi(
    getMyStylistProfile,
    []
  );

  const profile = data?.stylist || data || {};

  const handleSubmit = async (values) => {
    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => {
      if (v == null || v === "") return;
      if (k === "profile_photo" && v instanceof File) fd.append(k, v);
      else if (k !== "profile_photo") fd.append(k, v);
    });
    try {
      await updateMyStylistProfile(fd);
      toast.success("Profile updated");
      run().catch(() => {});
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-sm text-gray-500">
          Update your public stylist profile and contact details.
        </p>
      </div>

      {error ? (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : (
        <Card>
          <CardContent className="p-6">
            {loading ? (
              <p className="text-sm text-gray-400">Loading…</p>
            ) : (
              <Formik
                enableReinitialize
                initialValues={{
                  profile_photo: null,
                  fullName: profile.fullName || profile.name || "",
                  nickname: profile.nickname || "",
                  specialization: profile.specialization || "",
                  email: profile.email || "",
                  phoneNumber: profile.phoneNumber || profile.phone || "",
                  experience_years: profile.experience_years || "",
                  about: profile.about || "",
                }}
                validationSchema={schema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-4">
                    <FormFileUpload
                      name="profile_photo"
                      label="Profile Photo"
                      accept="image/png,image/jpeg"
                      maxSizeMB={2}
                    />
                    <FormInput name="fullName" label="Full Name" required />
                    <div className="grid grid-cols-2 gap-3">
                      <FormInput name="nickname" label="Known as (Nick Name)" />
                      <FormInput name="specialization" label="Specialization" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <FormInput name="email" label="Email" type="email" required />
                      <FormInput name="phoneNumber" label="Phone Number" required />
                    </div>
                    <FormInput name="experience_years" label="Experience" placeholder="e.g, 5 years" />
                    <FormTextarea name="about" label="About" rows={4} />

                    <div className="flex justify-end pt-2">
                      <Button
                        type="submit"
                        className="h-11 bg-primary1 hover:bg-primary1/90 text-white px-8"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Saving…" : "Save Changes"}
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StylistProfilePage;
