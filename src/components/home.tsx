import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import {
  Newspaper,
  Bell,
  BarChart3,
  LineChart,
  Sparkles,
  Home as HomeIcon,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import DataBar from "./DataBar";
import AIInsightBar from "./AIInsightBar";
import EtchedText from "./EtchedText";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-cards";
// Import required modules
import { EffectCards } from "swiper/modules";

const Home = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  const navItems = [
    {
      to: "/news",
      icon: <Newspaper className="h-8 w-8" />,
      label: "News Feed",
      description: "AI-curated market insights",
      color: "bg-blue-900 text-blue-300",
    },
    {
      to: "/alerts",
      icon: <Bell className="h-8 w-8" />,
      label: "Smart Alerts",
      description: "Price movement notifications",
      color: "bg-indigo-900 text-indigo-300",
    },
    {
      to: "/trades",
      icon: <BarChart3 className="h-8 w-8" />,
      label: "Trade Tracker",
      description: "Monitor your positions",
      color: "bg-cyan-900 text-cyan-300",
    },
    {
      to: "/performance",
      icon: <LineChart className="h-8 w-8" />,
      label: "Performance",
      description: "Track your trading metrics",
      color: "bg-sky-900 text-sky-300",
    },
  ];

  const handleSlideChange = (swiper: any) => {
    setActiveIndex(swiper.activeIndex);
  };

  const handleNavigate = () => {
    navigate(navItems[activeIndex].to);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex flex-col relative overflow-hidden">
      <DataBar />

      <div className="container mx-auto px-4 mt-2">
        <AIInsightBar />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-blue-500/20"
              style={{
                width: Math.random() * 300 + 100,
                height: Math.random() * 300 + 100,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, Math.random() * 50 - 25],
                y: [0, Math.random() * 50 - 25],
              }}
              transition={{
                duration: Math.random() * 30 + 20,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Header section */}
        <motion.div
          className="relative z-10 mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            <span className="text-blue-400">EDGE</span>AI
          </h1>
          <p className="text-gray-300 text-base md:text-lg max-w-xs mx-auto">
            Advanced Trading Intelligence
          </p>
        </motion.div>

        {/* Swipeable navigation */}
        <div className="w-full max-w-sm mx-auto relative z-10 px-4 mb-8">
          <Swiper
            effect={"cards"}
            grabCursor={true}
            modules={[EffectCards]}
            className="mySwiper h-300 w-full max-w-md mx-auto"
            onSlideChange={handleSlideChange}
          >
            {navItems.map((item, index) => (
              <SwiperSlide
                key={index}
                className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-soft border border-gray-700/50 overflow-hidden"
              >
                <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                  <div
                    className={`${item.color} p-5 rounded-xl flex items-center justify-center mb-4`}
                  >
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {item.label}
                  </h3>
                  <p className="text-gray-300 text-sm mb-6">
                    {item.description}
                  </p>
                  <Button
                    onClick={handleNavigate}
                    className="bg-blue-600 hover:bg-blue-700 text-white border-none w-full"
                  >
                    Open {item.label}
                  </Button>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="flex justify-center mt-4 gap-1">
            {navItems.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all duration-300 ${index === activeIndex ? "w-6 bg-blue-400" : "w-1.5 bg-gray-600"}`}
              />
            ))}
          </div>
        </div>

        {/* Footer section */}
        <motion.div
          className="mt-4 text-center text-gray-400 text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <p>Powered by advanced AI algorithms</p>
        </motion.div>

        {/* Clear All Data Button */}
        <div className="absolute bottom-4 right-4 z-20">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl py-1.5 px-3 bg-gray-800/80 backdrop-blur-sm shadow-soft hover:shadow-soft-lg transition-all duration-300 border-gray-700 text-red-400 hover:text-red-300 hover:border-red-800 flex items-center gap-1 text-xs"
            onClick={() => {
              if (
                window.confirm(
                  "Are you sure you want to clear all data? This action cannot be undone.",
                )
              ) {
                // Clear localStorage data
                localStorage.clear();
                // Reload the page to reflect changes
                window.location.reload();
              }
            }}
          >
            <Trash2 className="h-3 w-3" />
            <span>Clear Data</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

// NavButton component removed as it's replaced by the swiper implementation

export default Home;
