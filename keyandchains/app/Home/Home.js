"use client";

import Navbar from "@/app/components/Navbar";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Home_ = () => {
  return (
    <>
      <Navbar />
      <main className="p-8">
        <h1 className="text-3xl font-bold">Welcome to Home</h1>
        <p>This page is protected and only visible to logged-in users.</p>
      </main>
    </>
  );
};

export default Home_;
