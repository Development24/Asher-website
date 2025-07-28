"use client";

import { Button } from "@/components/ui/button";
import { userStore } from "@/store/userStore";
import { motion } from "framer-motion";
import {
  Calendar,
  DollarSign,
  Facebook,
  Headphones,
  HomeIcon,
  Instagram,
  Linkedin,
  Shield,
  Star,
  Twitter,
  Users,
  Zap
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Lazy load auth modals for better performance
const LoginModal = dynamic(() => import("./components/auth/LoginModal"), { 
  ssr: false, 
  loading: () => null 
});
const SignUpModal = dynamic(() => import("./components/auth/SignUpModal"), { 
  ssr: false, 
  loading: () => null 
});
const VerificationModal = dynamic(() => import("./components/auth/VerificationModal"), { 
  ssr: false, 
  loading: () => null 
});
const SuccessModal = dynamic(() => import("./components/auth/SuccessModal").then(mod => ({ default: mod.SuccessModal })), { 
  ssr: false, 
  loading: () => null 
});
import { Card } from "./components/Card";
import { FAQ } from "./components/FAQ";
import { FeaturedProperties } from "./components/FeaturedProperties";
import SearchBar from "./components/SearchBar";
import LoginHeaderItems from "./dashboard/components/LoginHeaderItems";
import { Sidebar } from "./dashboard/components/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export function HomeClient() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const user = userStore((state) => state.user);
  const router = useRouter();
  const handleVerificationNeeded = (email: string) => {
    setVerificationEmail(email);
    setShowSignUpModal(false);
    setShowVerificationModal(true);
  };

  const handleVerificationSuccess = () => {
    setShowVerificationModal(false);
    setShowLoginModal(true);
    // router.push(`/property/${propertyData?.id}/email`);
  };

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="space-y-5 max-w-8xl mx-auto p-5">
        <Skeleton className="aspect-video w-full rounded-md min-h-[450px]" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Skeleton className="w-full h-full" />
          <Skeleton className="w-full h-full" />
          <Skeleton className="w-full h-full" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="w-full min-h-[300px]" />
          <Skeleton className="w-full min-h-[300px]" />
        </div>
        <Skeleton className="w-full min-h-[300px]" />
      </div>
    );
  }

  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[800px]">
        <video
          src="https://cdn.pixabay.com/video/2022/01/06/103684-664327976_large.mp4"
          autoPlay
          loop
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />

        {/* Add logo image */}
        <div className="absolute top-8 left-8 z-20">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logoasher-fnyHiIbLgKYO0w8dKX1bfxuip3Ucba.png"
            alt="Asher Home Solution"
            width={180}
            height={60}
            className="h-12 w-auto"
          />
        </div>

        {/* Auth Buttons */}
        {isHydrated && (
          <>
            {user ? (
              <div className="flex items-center gap-4 absolute top-4 right-4 z-20">
                <LoginHeaderItems onMenuClick={toggleSidebar} />
                <Sidebar
                  isOpen={isSidebarOpen}
                  onClose={() => setIsSidebarOpen(false)}
                />
              </div>
            ) : (
              <div className="absolute top-4 right-4 z-20 flex gap-4">
                <Button
                  variant="outline"
                  className="border-white text-primary-800 hover:bg-white hover:text-primary-900"
                  onClick={() => setShowLoginModal(true)}
                >
                  Log In
                </Button>
                <Button
                  className="bg-primary-700 text-white hover:bg-primary-800"
                  onClick={() => setShowSignUpModal(true)}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </>
        )}

        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col items-center justify-center text-white">
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Your Perfect Home Awaits
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-center mb-12 max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Discover your dream property with our extensive listings and expert
            guidance. Start your journey home today.
          </motion.p>
          <motion.div
            className="w-full max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <SearchBar />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="layout py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Find Your Future Home, Hassle-Free.
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              We're here to guide every step towards your perfect home, making
              your house-hunting journey smooth and rewarding.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <HomeIcon className="w-8 h-8 text-primary-700" />,
                title: "Wide Range of Properties",
                description:
                  "Browse through our extensive collection of handpicked properties suited to your needs."
              },
              {
                icon: <Calendar className="w-8 h-8 text-primary-700" />,
                title: "Seamless Booking Process",
                description:
                  "Book viewings and manage appointments with just a few clicks."
              },
              {
                icon: <Users className="w-8 h-8 text-primary-700" />,
                title: "Expert Guidance",
                description:
                  "Get professional advice and support throughout your journey."
              },
              {
                icon: <Shield className="w-8 h-8 text-primary-700" />,
                title: "Secure Transactions",
                description:
                  "Our platform ensures safe and secure property transactions."
              },
              {
                icon: <Star className="w-8 h-8 text-primary-700" />,
                title: "Premium Listings",
                description:
                  "Access exclusive, high-quality properties not available elsewhere."
              },
              {
                icon: <Zap className="w-8 h-8 text-primary-700" />,
                title: "Fast Response Times",
                description:
                  "Quick replies from property owners and our support team."
              },
              {
                icon: <Headphones className="w-8 h-8 text-primary-700" />,
                title: "24/7 Customer Support",
                description:
                  "Round-the-clock assistance for all your queries and concerns."
              },
              {
                icon: <DollarSign className="w-8 h-8 text-primary-700" />,
                title: "Competitive Pricing",
                description:
                  "Find the best deals and offers on properties in your desired location."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card>
                  <div className="flex flex-col items-center text-center">
                    {feature.icon}
                    <h3 className="text-xl font-bold mt-4 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <FeaturedProperties />

      {/* Platform Features */}
      <section className="layout py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative">
              <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-2xl p-6 overflow-hidden">
                {/* White bar with building icon */}
                <div className="bg-white rounded-xl p-4 shadow-lg mb-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary-700 rounded-full p-2">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Effortless Property Management
                      </h3>
                      <p className="text-sm text-gray-600">
                        Manage everything in one place.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hand holding house image */}
                <div className="relative z-10 flex justify-center">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDI0LTA4L2Rlc2lnbndpdGhtZTA5X2FfcGhvdG9fb2ZfYnVzaW5lc3NfbWFuc19oYW5kX2hvbGRpbmdfYV9ob3VzZV9tb19lZDQ2ZGE2YS04MTU2LTQwYWUtYmM3Zi1hOTE5ZjY4MTBhODMucG5n-5sLQuXvAdf75tcVu51gweI5gp7dLw9.webp"
                    alt="Property Management"
                    className="w-3/4 h-auto max-w-xs mx-auto"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <span className="text-primary-700 font-semibold text-sm uppercase tracking-wider">
                SIMPLIFY PROPERTY MANAGEMENT
              </span>
              <h2 className="text-3xl md:text-4xl font-bold">
                Easily manage listings, tenants, and finances from one platform.
              </h2>
              <p className="text-gray-600 text-lg">
                Streamline property management with our user-friendly platform.
                Effortlessly list properties, manage tenants, and track
                finances—all from one place.
              </p>
              <Button className="bg-primary-700 hover:bg-primary-800 text-white px-8">
                Learn more
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Get Started Section */}
      <section className="relative py-20 overflow-hidden bg-gray-900">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'url("https://cdn.pixabay.com/photo/2020/05/09/09/13/house-5148865_960_720.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.4)" // Darkens the image for better text contrast
          }}
        />
        <div className="layout px-4 relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl font-bold text-white mb-4"
              >
                Ready to Find Your Perfect Home?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg text-gray-300"
              >
                Sign up now to start your search for the perfect home. Explore
                listings, save favorites, and get personalized recommendations
                to make your home journey smooth and effortless.
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button
                size="lg"
                className="bg-white text-gray-900 hover:bg-gray-100 text-lg px-8"
              >
                Get started
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Your Questions, Answered.
            </h2>
          </motion.div>
          <div className="max-w-3xl mx-auto">
            <FAQ />
          </div>
        </div>
      </section>

      {/* Gradient Divider */}
      <div className="h-[10px] bg-gradient-to-r from-red-600 to-transparent" />

      {/* Footer */}
      <footer className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">QUICK LINKS</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-600 hover:text-primary-700"
                  >
                    About us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-gray-600 hover:text-red-600"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-gray-600 hover:text-red-600"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">QUICK LINKS</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-600 hover:text-red-600"
                  >
                    About us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-gray-600 hover:text-red-600"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-gray-600 hover:text-red-600"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">CONTACT US</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/overview"
                    className="text-gray-600 hover:text-red-600"
                  >
                    Overview
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sitemap"
                    className="text-gray-600 hover:text-red-600"
                  >
                    Sitemap
                  </Link>
                </li>
                <li>
                  <Link
                    href="/events"
                    className="text-gray-600 hover:text-red-600"
                  >
                    Events
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">SOCIAL</h3>
              <div className="flex space-x-4">
                <Link href="#" className="text-gray-600 hover:text-red-600">
                  <Facebook className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-gray-600 hover:text-red-600">
                  <Twitter className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-gray-600 hover:text-red-600">
                  <Instagram className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-gray-600 hover:text-red-600">
                  <Linkedin className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-gray-500">
            <p>© 2024, Asher. All Rights Reserved.</p>
          </div>
        </div>
      </footer>

      {/* Auth Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSignUpClick={() => {
          setShowLoginModal(false);
          setShowSignUpModal(true);
        }}
      />

      <SignUpModal
        isOpen={showSignUpModal}
        onClose={() => setShowSignUpModal(false)}
        onLoginClick={() => {
          setShowSignUpModal(false);
          setShowLoginModal(true);
        }}
        onVerificationNeeded={handleVerificationNeeded}
      />

      <VerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        email={verificationEmail}
        onVerificationSuccess={handleVerificationSuccess}
      />

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message="Your account has been successfully created and verified!"
      />
    </main>
  );
}
