// app/contact/page.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLayout from "@/layouts/app-layout";

const ContactPage = () => {
  return (
    <AppLayout>
      <section className="py-16 md:py-32">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col gap-10 lg:flex-row lg:gap-20">
            {/* Left Panel */}
            <div className="flex flex-col gap-10 max-w-lg mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl mb-4">
                  Contact Us
                </h1>
                <p className="text-muted-foreground">
                  We are available for questions, feedback, or collaboration
                  opportunities. Let us know how we can help!
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Contact Details</h3>
                <ul className="ml-4 list-disc text-muted-foreground">
                  <li>
                    <strong>Phone:</strong> (123) 34567890
                  </li>
                  <li>
                    <strong>Email:</strong>{" "}
                    <a
                      href="mailto:your-email@example.com"
                      className="underline"
                    >
                      your-email@example.com
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Form */}
            <div className="w-full max-w-2xl mx-auto border rounded-lg p-6 md:p-10 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full">
                  <Label htmlFor="firstname">First Name</Label>
                  <Input type="text" id="firstname" placeholder="First Name" />
                </div>
                <div className="w-full">
                  <Label htmlFor="lastname">Last Name</Label>
                  <Input type="text" id="lastname" placeholder="Last Name" />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input type="email" id="email" placeholder="Email" />
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input type="text" id="subject" placeholder="Subject" />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <textarea
                  id="message"
                  placeholder="Type your message here."
                  className="w-full h-32 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md">
                Send Message
              </Button>
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  );
};

export default ContactPage;
