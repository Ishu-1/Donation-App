"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


export default function Home() {

  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const handleNavigation = (path) => {
    router.push(path);
  };

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/login");
    } else {
      setLoading(false);
    }
  }, [session, status, router]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="font-serif">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-white via-[#fdfdfd] to-[#f5f5f5] py-20 px-6 md:px-20">
        <div className="grid md:grid-cols-2 items-center gap-12 max-w-7xl mx-auto">

          {/* Text Content */}
          <div>
            <p className="text-primary text-sm uppercase tracking-wide mb-2">Join us in making a difference</p>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6 bg-gradient-to-r from-emerald-500 to-lime-500 text-transparent bg-clip-text">
              Empower Change<br /> Through Giving
            </h1>
            <p className="text-gray-700 mb-8 text-lg">
              Connect with NGOs and individuals in need. Donate items with ease and make a real impact.
            </p>
            <button
              onClick={() => handleNavigation("/products")}
              className="bg-emerald-500 hover:cursor-pointer text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-600 transition"
            >
              Get Involved
            </button>
          </div>

          {/* Hero Image */}
          <div>
            <img
              src="/do.jpg"
              alt="Hero"
              className="w-full h-auto rounded-2xl shadow-2xl object-cover"
            />
          </div>
        </div>

        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-transparent via-gray-100 to-transparent z-0"></div>
      </section>



      {/* Mission Section */}
      <section className="grid md:grid-cols-2 gap-10 items-center py-20 px-6 bg-[#f5f5f0]">
        <img
          src="/mv.jpg"
          alt="Volunteers"
          className="w-full rounded-xl shadow-lg"
        />
        <div>
          <h2 className="text-4xl font-bold mb-4">Our Mission and Vision</h2>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Who We Are</h3>
          <p className="text-gray-700 text-lg leading-relaxed">
            DoNation is dedicated to connecting donors with NGOs and individuals in need,
            creating a seamless platform for item donation and distribution. Our goal is to make
            giving easy, efficient, and impactful.
          </p>
        </div>
      </section>

      {/* Initiatives Section */}
      <section className="py-20 px-6">
        <h2 className="text-4xl font-bold text-center mb-12">Our Initiatives</h2>
        <div className="grid md:grid-cols-3 gap-10">
          <div className="text-center">
            <img
              src="/cs.webp"
              alt="Community Support"
              className="w-full h-64 object-cover rounded-xl mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Community Support</h3>
            <p className="text-gray-700">
              We focus on supporting communities by distributing essential items to those in need.
              Join us in making a difference by contributing to our community projects.
            </p>
          </div>
          <div className="text-center">
            <img
              src="/es.webp"
              alt="Education Programs"
              className="w-full h-64 object-cover rounded-xl mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Education Programs</h3>
            <p className="text-gray-700">
              Education is key to a better future. Through our programs, we provide educational resources
              and tools to empower individuals for success.
            </p>
          </div>
          <div className="text-center">
            <img
              src="/ea.jpeg"
              alt="Emergency Aid"
              className="w-full h-64 object-cover rounded-xl mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Emergency Aid</h3>
            <p className="text-gray-700">
              During crises, quick aid is crucial. Our emergency support initiatives ensure timely
              assistance reaches those affected the most.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
