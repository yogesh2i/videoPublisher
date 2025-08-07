import React from "react";
import Card from "../Components/Dashboard/Card";

export default function Page() {
  return (
    <>
      <div id="dashboard-page" className="w-full max-w-4xl mx-auto py-8 px-4">
        <h2 className="text-4xl font-extrabold text-center text-blue-800 mb-14 tracking-tight">
          Choose your next action
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Card
            title={"Publish New Video"}
            description={"Upload a video and let AI generate titles, descriptions, and tags for you."}
            link={"/content/upload"}
            svg={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="60"
                height="60"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-600 transition-all duration-300 ease-in-out mb-6 group-hover:text-blue-700 group-hover:scale-110"
              >
                <path d="M5 12h14"></path>
                <path d="M12 5v14"></path>
              </svg>
            }
          />
          <Card
            title={"Video Analytics"}
            description={"Analyze your videos to find potential viral moments and optimize for short-form content."}
            link={"/analyze"}
            svg={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="60"
                height="60"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-600 transition-all duration-300 ease-in-out mb-6 group-hover:text-blue-700 group-hover:scale-110"
              >
                <path d="M3 3v18h18"></path>
                <path d="M18 17V9"></path>
                <path d="M13 17V5"></path>
                <path d="M8 17v-3"></path>
              </svg>
            }
          />
        </div>
      </div>
    </>
  );
}
