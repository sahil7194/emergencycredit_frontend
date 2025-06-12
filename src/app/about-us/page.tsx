"use client";

import { CircleArrowRight, Files, Settings } from "lucide-react";
import Image from "next/image";
import AppLayout from "@/layouts/app-layout";

const AboutUsPage = () => {
  return (
    <AppLayout>
      <section className="py-32 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-28">
          {/* Header Section */}
          <div className="flex flex-col gap-7">
            <h1 className="text-4xl font-semibold lg:text-7xl">
              Bringing the power of software to everyone
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              Stacker makes it easy to build customer portals, CRMs, internal
              tools, and other business applications for your team. In minutes,
              not months.
            </p>
          </div>

          {/* Mission Section */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Image Block */}
            <div className="aspect-square w-full rounded-2xl overflow-hidden border">
              <Image
                src="https://shadcnblocks.com/images/block/placeholder-1.svg"
                alt="placeholder"
                width={600}
                height={600}
                className="h-full w-full object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Mission Block (Fixed) */}
            <div className="w-full rounded-2xl bg-muted p-6 sm:p-8 md:p-10 flex flex-col gap-4 border">
              <p className="text-sm text-muted-foreground">OUR MISSION</p>
              <p className="text-lg font-medium text-foreground">
                We believe that building software should be insanely easy. That
                everyone should have the freedom to create the tools they need,
                without any developers, designers or drama.
              </p>
            </div>
          </div>

          {/* Values Section */}
          <div className="flex flex-col gap-6 md:gap-20">
            <div className="max-w-xl">
              <h2 className="mb-2.5 text-3xl font-semibold md:text-5xl">
                We make creating software ridiculously easy
              </h2>
              <p className="text-muted-foreground">
                We aim to help empower 1,000,000 teams to create their own
                software. Here is how we plan on doing it.
              </p>
            </div>

            <div className="grid gap-10 md:grid-cols-3">
              {[{
                  icon: Files,
                  title: "Being radically open",
                  description:
                    "We believe there’s no room for big egos and there’s always time to help each other. We strive to give and receive feedback, ideas, perspectives.",
                },
                {
                  icon: CircleArrowRight,
                  title: "Moving the needle",
                  description:
                    "Boldly, bravely and with clear aims. We seek out the big opportunities and double down on the most important things to work on.",
                },
                {
                  icon: Settings,
                  title: "Optimizing for empowerment",
                  description:
                    "We believe that everyone should be empowered to do whatever they think is in the company’s best interests.",
                }
              ].map((item) => (
                <div className="flex flex-col" key={item.title}>
                  <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-accent">
                    <item.icon className="size-5" />
                  </div>
                  <h3 className="mt-2 mb-3 text-lg font-semibold">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Join Section */}
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <p className="mb-10 text-sm font-medium text-muted-foreground">
                JOIN OUR TEAM
              </p>
              <h2 className="mb-2.5 text-3xl font-semibold md:text-5xl">
                <p>{`We're changing how software is made.`}</p>
              </h2>
            </div>
            <div>
              <Image
                src="https://shadcnblocks.com/images/block/placeholder-1.svg"
                alt="placeholder"
                width={600}
                height={144}
                className="mb-6 max-h-36 w-full rounded-xl object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <p className="text-muted-foreground">
                {`And we're looking for the right people to help us do it. If
                you're passionate about making change in the world, this might
                be the place for you.`}
              </p>
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  );
};

export default AboutUsPage;
