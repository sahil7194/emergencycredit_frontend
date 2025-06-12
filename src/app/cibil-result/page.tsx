"use client";
import React, { useEffect, useState, Suspense } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useSearchParams } from "next/navigation";

const CibilResultContent = () => {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");

  const [cibilData, setCibilData] = useState<{
    score?: number;
    name?: string;
    email?: string;
    mobile?: string;
  }>({});

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(isDark);
    }
  }, []);

  useEffect(() => {
    if (!slug) {
      setError("Missing slug in URL.");
      setIsLoading(false);
      return;
    }

    async function fetchCibil() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cibil-check`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch CIBIL data");
        }

        const result = await response.json();

        if (!result.success || !result.cibil) {
          throw new Error(result.message || "CIBIL data unavailable");
        }

        const { score, name, email, mobile } = result.cibil;
        setCibilData({ score, name, email, mobile });
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCibil();
  }, [slug]);

  const numericScore = cibilData.score ?? null;
  const scorePercentage = numericScore ? (numericScore / 900) * 100 : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading CIBIL data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-center text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
          CIBIL Score Details
        </h2>

        {numericScore === null || isNaN(numericScore) ? (
          <p className="text-center text-gray-500 dark:text-gray-300">
            CIBIL Score not available yet
          </p>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-40 h-40 mb-4">
              <CircularProgressbar
                value={scorePercentage}
                text={`${numericScore}`}
                strokeWidth={12}
                styles={buildStyles({
                  pathColor: "#4caf50",
                  textColor: isDarkMode ? "#ffffff" : "#000000",
                  trailColor: isDarkMode ? "#374151" : "#d6d6d6",
                  textSize: "28px",
                })}
              />
            </div>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Your current CIBIL score
            </p>
          </div>
        )}

        <div className="mt-6">
          <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">
            User Details:
          </h3>
          <div className="space-y-1 text-gray-700 dark:text-gray-300">
            <p><strong>Name:</strong> {cibilData.name || "N/A"}</p>
            <p><strong>Email:</strong> {cibilData.email || "N/A"}</p>
            <p><strong>Mobile:</strong> {cibilData.mobile || "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const CibilResult = () => {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <CibilResultContent />
    </Suspense>
  );
};

export default CibilResult;

