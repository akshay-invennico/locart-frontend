import FileUpload from "../modules/FileUpload";
import { Input } from "../ui/input";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { storeCreate } from "@/state/store/storeSlice";  
import { toast } from "sonner";


export default function CreateStore({ onClose }) {

  const [storeLogo, setStoreLogo] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    map: "",
    phone: "",
    email: "",
    website: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    twitter: "",
    about: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const formData = new FormData();
  
    if (storeLogo) formData.append("logo", storeLogo);
    if (coverImage) formData.append("coverImage", coverImage);
  
    formData.append("name", form.name);
    formData.append("streetAddress", form.address);
    formData.append("city", form.city);
    formData.append("state", form.state);
    formData.append("zipCode", form.zip);
    formData.append("mapLink", form.map);
    formData.append("phone", form.phone);
    formData.append("email", form.email);
    formData.append("website", form.website);
    formData.append("facebook", form.facebook);
    formData.append("instagram", form.instagram);
    formData.append("linkedin", form.linkedin); 
    formData.append("twitter", form.twitter);
    formData.append("about", form.about);
  
    dispatch(storeCreate(formData))
      .unwrap()
      .then(() => {
        toast("Store created successfully!");
        onClose();
      })
      .catch((err) => {
        console.error("Error:", err);
        toast(err || "Error creating store");
      });
  };  

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-6 overflow-y-auto max-h-[90vh]">

        <h2 className="text-xl font-semibold">Create Store</h2>
        <p className="text-gray-500 mb-6">Enter your store details to create your profile.</p>

        <div className="mb-4">
          <label className="text-black text-[14px] font-medium mb-3">Store Logo</label>
          <FileUpload onChange={(file) => setStoreLogo(file)} />
        </div>

        <div className="mb-4">
          <label className="text-black text-[14px] font-medium mb-3">Cover Image</label>
          <FileUpload onChange={(file) => setCoverImage(file)} />
        </div>

        <div className="grid grid-cols-1 gap-3">

          <label className="flex flex-col gap-1">
            <span>Store Name</span>
            <Input name="name" value={form.name} onChange={handleChange} placeholder="Store Name" className="input" />
          </label>

          <label className="flex flex-col gap-1">
            <span>Street Address</span>
            <Input name="address" value={form.address} onChange={handleChange} placeholder="Street Address" className="input" />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span>City</span>
              <Input name="city" value={form.city} onChange={handleChange} placeholder="City" className="input" />
            </label>

            <label className="flex flex-col gap-1">
              <span>State</span>
              <Input name="state" value={form.state} onChange={handleChange} placeholder="State" className="input" />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span>Zip Code</span>
              <Input name="zip" value={form.zip} onChange={handleChange} placeholder="Zip Code" className="input" />
            </label>

            <label className="flex flex-col gap-1">
              <span>Map Link</span>
              <Input name="map" value={form.map} onChange={handleChange} placeholder="Map Link" className="input" />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span>Phone</span>
              <Input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="input" />
            </label>

            <label className="flex flex-col gap-1">
              <span>Email</span>
              <Input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="input" />
            </label>
          </div>

          <label className="flex flex-col gap-1">
            <span>Website</span>
            <Input name="website" value={form.website} onChange={handleChange} placeholder="Website" className="input" />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span>Facebook</span>
              <Input name="facebook" value={form.facebook} onChange={handleChange} placeholder="Facebook" className="input" />
            </label>

            <label className="flex flex-col gap-1">
              <span>Instagram</span>
              <Input name="instagram" value={form.instagram} onChange={handleChange} placeholder="Instagram" className="input" />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span>Linkedin</span>
              <Input name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="Linkedin" className="input" />
            </label>

            <label className="flex flex-col gap-1">
              <span>Twitter</span>
              <Input name="twitter" value={form.twitter} onChange={handleChange} placeholder="Twitter" className="input" />
            </label>
          </div>

          <label className="flex flex-col gap-1">
            <span>About</span>
            <textarea
              name="about"
              value={form.about}
              onChange={handleChange}
              rows="4"
              placeholder="Write something about the salon"
              className="input resize-y px-3 py-2 border rounded-xl"
            ></textarea>
          </label>
        </div>

        <div className="flex justify-between mt-6 gap-x-6">
          <button onClick={onClose} className="w-full px-6 py-2 border border-gray-300 rounded-lg cursor-pointer">
            Cancel
          </button>

          <button onClick={handleSubmit} className="w-full px-6 py-2 bg-primary1 text-white rounded-lg cursor-pointer">
            Create Store
          </button>
        </div>
      </div>
    </div>
  );
}
