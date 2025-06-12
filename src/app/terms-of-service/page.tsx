'use client';

import AppLayout from '@/layouts/app-layout';

const TermsOfService = () => {
  return (
    <AppLayout>
      <div className="bg-white text-black dark:bg-black dark:text-white">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <p className="mb-4 text-sm text-muted-foreground">
            Effective Date: 2024-07-15
          </p>

          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-orange-800 dark:text-orange-300">
            Terms of Service for Your Business
          </h1>

          <p className="mb-6 text-base leading-relaxed">
            Welcome to the website. Please read these terms of service carefully before using the
            website. By using the website, you agree to be bound by these terms of service. If you
            do not agree, you may not use the website. These terms govern your use of the website
            and all services provided by the website.
          </p>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-orange-700 dark:text-orange-300">
              General
            </h2>

            <ul className="list-disc pl-6 space-y-4 text-base">
              <li>
                By accessing this website, you agree to be bound by these terms of service, all
                applicable laws and regulations, and agree that you are responsible for compliance
                with any applicable local laws.
              </li>
              <li>
                We reserve the right to change these terms of service at any time without notice. By
                using this website you agree to be bound by the then-current version of these terms.
                Any updates will be sent via email.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default TermsOfService;
