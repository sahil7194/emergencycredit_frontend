"use client";
import React, { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import AppLayout from "@/layouts/app-layout";
import { Label } from "@/components/ui/label";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';

const states = [
  { id: "1", name: "Maharashtra" },
  { id: "2", name: "Karnataka" },
  { id: "3", name: "Delhi" },
];

const cities = [
  { id: "1", name: "Mumbai" },
  { id: "2", name: "Pune" },
  { id: "3", name: "Bengaluru" },
];

type FormData = {
  full_name: string;
  date_of_birth: string;
  gender: string;
  pan_card_number: string;
  mobile: string;
  mobileOtp: string;
  email: string;
  emailOtp: string;
  address: string;
  pin_code: string;
  state_id: string;
  city_id: string;
};

export default function CheckCibilPage() {
  const router = useRouter()
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  const [step, setStep] = useState(1);
 
  const [processing, setProcessing] = useState(false);
  const [otpVerifiedMobile, setOtpVerifiedMobile] = useState(false);
  const [otpVerifiedEmail, setOtpVerifiedEmail] = useState(false);


  const [form, setForm] = useState<FormData>({
    full_name: "",
    date_of_birth: "",
    gender: "",
    pan_card_number: "",
    mobile: "",
    mobileOtp: "",
    email: "",
    emailOtp: "",
    address: "",
    pin_code: "",
    state_id: "",
    city_id: "",
  });

  const [otpSentMobile, setOtpSentMobile] = useState(false);
  const [otpSentEmail, setOtpSentEmail] = useState(false);
  const [slug, setSlug] = useState("");


  if (!mounted) return null;

  // Helper to update form fields
  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Validation per step (simple required fields)
  const validateStep = () => {
    if (step === 1) {
      return (
        form.full_name.trim() !== "" &&
        form.date_of_birth.trim() !== "" &&
        form.gender.trim() !== "" &&
        form.pan_card_number.trim() !== ""
      );
    }
   if (step === 2) {
    return (
      form.mobile.trim() !== "" &&
      otpSentMobile &&
      otpVerifiedMobile && // ✅ Only allow if verified
      form.email.trim() !== "" &&
      otpSentEmail &&
      otpVerifiedEmail // ✅ Only allow if verified
    );
  }
    if (step === 3) {
      return (
        form.address.trim() !== "" &&
        form.pin_code.trim() !== "" &&
        form.state_id.trim() !== "" &&
        form.city_id.trim() !== ""
      );
    }
    return true;
  };


  const sendOtpMobile = async () => {
    console.log("Sending OTP with slug:", slug, "and mobile:", form.mobile);
  if (!form.mobile.match(/^\d{10}$/)) {
    alert("Please enter a valid 10-digit mobile number before sending OTP");
    return;
  }
  try {
    setProcessing(true);
   
    const res = await fetch( `${process.env.NEXT_PUBLIC_API_URL}/api/request-opt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_identifier: form.mobile,slug: slug }),
    });
    if (!res.ok) throw new Error('Failed to send OTP');
    setOtpSentMobile(true);
    toast.success(`OTP sent to mobile: ${form.mobile}`);
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message);
    } else {
      alert("An unknown error occurred.");
    }
  } finally {
    setProcessing(false);
  }
};


 const sendOtpEmail = async () => {
  if (
    !form.email.match(
      /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
    )
  ) {
    alert("Please enter a valid email before sending OTP");
    return;
  }

  try {
    setProcessing(true);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/request-opt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_identifier: form.email,
        slug: slug,
        // slug: 'your-slug-here' // optional, if you later want to include it
      }),
    });

    if (!res.ok) throw new Error('Failed to send OTP');

    setOtpSentEmail(true);
    toast.success(`OTP sent to email: ${form.email}`);
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message);
    } else {
      alert("An unknown error occurred.");
    }
  } finally {
    setProcessing(false);
  }
};




const handleNext = async () => {
  if (!validateStep()) {
    alert("Please fill all required fields and verify OTPs before proceeding.");
    return;
  }

  setProcessing(true);

  try {
    if (step === 1) {
      // Step 1 API call: Save personal details
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/check-cibil/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: form.full_name,
          date_of_birth: form.date_of_birth,
          gender: form.gender,
          pan_card_number: form.pan_card_number,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save personal details");
      }
      const data = await response.json();

      // Save slug from response for use in step 2 and beyond
      setSlug(data.data.slug);
      console.log('andar',data.data.slug)
    }

    // TODO: Add similar API calls for step 2 and 3 here

    // Advance step only if API call is successful
    setStep((prev) => (prev < 3 ? prev + 1 : prev));
    console.log('bahar',slug)
  } catch (error: any) {
    alert(error.message || "Something went wrong. Please try again.");
  } finally {
    setProcessing(false);
  }
};


  const handleBack = () => {
    setStep((prev) => (prev > 1 ? prev - 1 : prev));
  };




const verifyOtp = async (otp: string, user_identifier: string, slug: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/verify-opt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json", // important to avoid HTML response
      },
      body: JSON.stringify({
        otp,
        user_identifier,
        slug,
      }),
    });

    const data = await response.json(); // always try parsing JSON

    if (!response.ok || data.success === false) {
      toast.error(data.message || "OTP verification failed.");
      return;
    }

    toast.success(data.message || "OTP verified successfully!");

    // ✅ Update verification state
    if (user_identifier.includes("@")) {
      setOtpVerifiedEmail(true);
    } else {
      setOtpVerifiedMobile(true);
    }
  } catch (error: any) {
    toast.error(error.message || "Something went wrong. Please try again.");
  }
};






  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateStep()) {
      alert("Please fill all required fields before submitting.");
      return;
    }
    setProcessing(true);
    // Simulate server request
    try {
    // Call your API with the slug to get the CIBIL score and other info
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cibil-check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }), // Pass only slug
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to get CIBIL score");
    }

    const result = await response.json();

    // Assuming result contains score and user info
    const { score, name, email, mobile } = result.cibil;
    console.log("CIBIL Score:", score);
    console.log("User Info:", { name, email, mobile });


    setProcessing(false);

    // Redirect only with slug and score (or just slug)
    router.push(`/cibil-result?slug=${slug}`);

    // Alternatively, you can just do router.push(`/cibil-result?slug=${slug}`);
    // and fetch score and user info on cibil-result page using slug.

  } catch (error: any) {
    setProcessing(false);
    alert(error.message || "Something went wrong. Please try again.");
  }
   
  };

  return (
    <AppLayout>
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl">
          <Card className="w-full px-4 py-6 sm:px-6 md:px-8">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-semibold">
                CIBIL Check
              </CardTitle>
              <p className="text-center text-sm text-gray-500 mt-1">
                Step {step} of 3
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {step === 1 && (
                  <section>
                    <h2 className="mb-4 text-lg font-semibold text-gray-700">
                      Personal Details
                    </h2>
                    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
                      <div>
                        <Label htmlFor="full_name" className="mb-2 block">Full Name</Label>
                        <Input
                          id="full_name"
                          required
                          value={form.full_name}
                          onChange={(e) =>
                            handleChange("full_name", e.target.value)
                          }
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <Label htmlFor="date_of_birth" className="mb-2 block">Date of Birth</Label>
                        <Input
                          id="date_of_birth"
                          type="date"
                          required
                          value={form.date_of_birth}
                          onChange={(e) =>
                            handleChange("date_of_birth", e.target.value)
                          }
                          className="bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                        />
                      </div>
                      <div>
                        <Label htmlFor="gender" className="mb-2 block">Gender</Label>
                        <select
                          id="gender"
                          required
                          value={form.gender}
                          onChange={(e) =>
                            handleChange("gender", e.target.value)
                          }
                          className="w-full rounded-md border border-gray-300 bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="pan_card_number" className="mb-2 block">PAN Card Number</Label>
                        <Input
                          id="pan_card_number"
                          required
                          value={form.pan_card_number}
                          onChange={(e) =>
                            handleChange(
                              "pan_card_number",
                              e.target.value.toUpperCase()
                            )
                          }
                          placeholder="ABCDE1234F"
                          maxLength={10}
                        />
                      </div>
                    </div>
                  </section>
                )}

               {step === 2 && (
  <section>
    <h2 className="mb-4 text-lg font-semibold text-foreground">
      Contact Details & OTP Verification
    </h2>

    <div className="grid gap-6 sm:grid-cols-1">
      {/* Mobile Block */}
      <div className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="mobile" className="mb-2 block">Mobile Number</Label>
            <Input
              id="mobile"
              required
              type="tel"
              inputMode="numeric"
              value={form.mobile}
              onChange={(e) => {
                if (!otpSentMobile) {
                  handleChange("mobile", e.target.value);
                }
              }}
              placeholder="10-digit mobile number"
              maxLength={10}
              disabled={otpSentMobile}
            />
          </div>
          <div>
            <Label htmlFor="mobileOtp" className="mb-2 block">Enter Mobile OTP</Label>
            <div className="relative">
  <Input
    id="mobileOtp"
    required
    value={form.mobileOtp}
    onChange={(e) => handleChange("mobileOtp", e.target.value)}
    placeholder="6-digit OTP"
    maxLength={6}
    disabled={!otpSentMobile}
    className="pr-[90px]" // space for button
  />
  {otpSentMobile && (
    <button
      type="button"
      onClick={() => verifyOtp(form.mobileOtp, form.mobile, slug)}
      className="absolute right-1 top-1/2 -translate-y-1/2 bg-green-600 text-white text-sm px-3 py-1 rounded hover:bg-green-700"
    >
      Verify
    </button>
  )}
</div>

          </div>
        </div>
       <Button
  type="button"
  onClick={sendOtpMobile}
  disabled={otpSentMobile}
  className="
    w-full              
    sm:w-auto          
    mx-auto           
    block                
    px-4 py-2
    bg-black text-white hover:bg-gray-800
    dark:bg-white dark:text-black dark:hover:bg-gray-200
    disabled:opacity-50
    rounded-md
    min-w-[100px]
    transition-colors
    text-sm sm:text-base
    font-semibold
  "
>
  {otpSentMobile ? "OTP Sent" : "Send OTP"}
</Button>

      </div>

      {/* Email Block */}
      <div className="grid gap-4 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email" className="mb-2 block">Email</Label>
            <Input
              id="email"
              required
              type="email"
              value={form.email}
              onChange={(e) => {
                if (!otpSentEmail) {
                  handleChange("email", e.target.value);
                }
              }}
              placeholder="example@mail.com"
              disabled={otpSentEmail}
            />
          </div>
          <div>
            <Label htmlFor="emailOtp" className="mb-2 block">Enter Email OTP</Label>
           <div className="relative">
  <Input
    id="emailOtp"
    required
    value={form.emailOtp}
    onChange={(e) => handleChange("emailOtp", e.target.value)}
    placeholder="6-digit OTP"
    maxLength={6}
    disabled={!otpSentEmail}
    className="pr-[90px]"
  />
  {otpSentEmail && (
    <button
      type="button"
      onClick={() => verifyOtp(form.emailOtp, form.email, slug)}
      className="absolute right-1 top-1/2 -translate-y-1/2 bg-green-600 text-white text-sm px-3 py-1 rounded hover:bg-green-700"
    >
      Verify
    </button>
  )}
</div>

          </div>
        </div>
     <Button
  type="button"
  onClick={sendOtpEmail}
  disabled={otpSentEmail}
  className="
    w-full              
    sm:w-auto          
    mx-auto           
    block                
    px-4 py-2
    bg-black text-white hover:bg-gray-800
    dark:bg-white dark:text-black dark:hover:bg-gray-200
    disabled:opacity-50
    rounded-md
    min-w-[100px]
    transition-colors
    text-sm sm:text-base
    font-semibold
  "
>
  {otpSentEmail ? "OTP Sent" : "Send OTP"}
</Button>


      </div>
    </div>
  </section>
)}


                {step === 3 && (
                  <section>
                    <h2 className="mb-4 text-lg font-semibold text-gray-700">
                      Address
                    </h2>
                    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
                      <div className="md:col-span-2">
                        <Label htmlFor="address" className="mb-2 block">Address</Label>
                        <textarea
                          id="address"
                          required
                          value={form.address}
                          onChange={(e) =>
                            handleChange("address", e.target.value)
                          }
                          className="h-24 w-full rounded-md border border-gray-300 bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-600 p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Street, Area, Landmark..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="pin_code" className="mb-2 block">Pin Code</Label>
                        <Input
                          id="pin_code"
                          required
                          value={form.pin_code}
                          onChange={(e) =>
                            handleChange("pin_code", e.target.value)
                          }
                          placeholder="400001"
                          maxLength={6}
                        />
                      </div>
                      <div>
                        <Label htmlFor="state_id" className="mb-2 block">State</Label>
                        <select
                          id="state_id"
                          required
                          value={form.state_id}
                          onChange={(e) =>
                            handleChange("state_id", e.target.value)
                          }
                          className="w-full rounded-md border border-gray-300 bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">Select State</option>
                          {states.map((state) => (
                            <option key={state.id} value={state.id}>
                              {state.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="city_id" className="mb-2 block">City</Label>
                        <select
                          id="city_id"
                          required
                          value={form.city_id}
                          onChange={(e) =>
                            handleChange("city_id", e.target.value)
                          }
                          className="w-full rounded-md border border-gray-300 bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">Select City</option>
                          {cities.map((city) => (
                            <option key={city.id} value={city.id}>
                              {city.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </section>
                )}

                {step === 4 && (
                  <section className="text-center text-gray-700 dark:text-gray-200">
                    <h2 className="mb-4 text-lg font-semibold">
                      Review & Submit
                    </h2>
                    <p className="mb-6">
                      Please review all your information before submission.
                    </p>

                    <div className="text-left space-y-3 max-w-md mx-auto text-sm bg-gray-50 dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                      <p>
                        <span className="font-semibold">Full Name:</span>{" "}
                        {form.full_name}
                      </p>
                      <p>
                        <span className="font-semibold">Date of Birth:</span>{" "}
                        {form.date_of_birth}
                      </p>
                      <p>
                        <span className="font-semibold">Gender:</span>{" "}
                        {form.gender}
                      </p>
                      <p>
                        <span className="font-semibold">PAN Card Number:</span>{" "}
                        {form.pan_card_number}
                      </p>
                      <p>
                        <span className="font-semibold">Mobile:</span>{" "}
                        {form.mobile}
                      </p>
                      <p>
                        <span className="font-semibold">Email:</span>{" "}
                        {form.email}
                      </p>
                      <p>
                        <span className="font-semibold">Address:</span>{" "}
                        {form.address}
                      </p>
                      <p>
                        <span className="font-semibold">Pin Code:</span>{" "}
                        {form.pin_code}
                      </p>
                      <p>
                        <span className="font-semibold">State:</span>{" "}
                        {states.find((s) => s.id === form.state_id)?.name || ""}
                      </p>
                      <p>
                        <span className="font-semibold">City:</span>{" "}
                        {cities.find((c) => c.id === form.city_id)?.name || ""}
                      </p>
                    </div>
                  </section>
                )}

                <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-4 pt-6">
                  {step > 1 ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      className="w-24"
                      disabled={processing}
                    >
                      Back
                    </Button>
                  ) : (
                    <div />
                  )}

                  {step < 3 ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      disabled={processing || !validateStep()}
                      className="w-24 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={processing || !validateStep()}
                      className="w-32 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                      {processing && (
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Submit
                    </Button>
                  )}
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </AppLayout>
  );
}
