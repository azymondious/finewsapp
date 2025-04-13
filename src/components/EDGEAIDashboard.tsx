import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  BarChart3,
  Bell,
  Newspaper,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const EDGEAIDashboard = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const logoVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10,
        duration: 0.8,
      },
    },
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "loop",
      },
    },
  };

  const floatVariants = {
    float: {
      y: ["-5px", "5px", "-5px"],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6 flex flex-col items-center justify-center overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-500/10"
            style={{
              width: Math.random() * 200 + 50,
              height: Math.random() * 200 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <motion.div
        className="relative z-10 max-w-7xl w-full mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
      >
        {/* Logo and title */}
        <motion.div className="text-center mb-16" variants={logoVariants}>
          <motion.div
            className="inline-block relative"
            animate="pulse"
            variants={pulseVariants}
          >
            <motion.div
              className="absolute -inset-10 bg-blue-500/20 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "loop",
              }}
            />
            <h1 className="text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-4 relative z-10">
              EDGE<span className="text-white">AI</span>
            </h1>
          </motion.div>
          <motion.p
            className="text-xl text-blue-200/80"
            variants={itemVariants}
          >
            Advanced Trading Intelligence
          </motion.p>
        </motion.div>

        {/* Dashboard cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            title="Performance Metrics"
            description="Track your trading performance"
            icon={<LineChart className="h-8 w-8 text-blue-400" />}
            to="/performance"
            variants={itemVariants}
            floatVariants={floatVariants}
          />
          <DashboardCard
            title="Trade Tracker"
            description="Monitor your active trades"
            icon={<BarChart3 className="h-8 w-8 text-purple-400" />}
            to="/trades"
            variants={itemVariants}
            floatVariants={floatVariants}
          />
          <DashboardCard
            title="Smart Alerts"
            description="Price movement notifications"
            icon={<Bell className="h-8 w-8 text-green-400" />}
            to="/alerts"
            variants={itemVariants}
            floatVariants={floatVariants}
          />
          <DashboardCard
            title="AI News Feed"
            description="Curated market insights"
            icon={<Newspaper className="h-8 w-8 text-amber-400" />}
            to="/news"
            variants={itemVariants}
            floatVariants={floatVariants}
          />
        </div>

        {/* Return to home */}
        <motion.div className="mt-12 text-center" variants={itemVariants}>
          <Link to="/">
            <Button
              variant="outline"
              className="text-blue-300 border-blue-800 hover:bg-blue-900/30"
            >
              Return to Home
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

interface DashboardCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
  variants: any;
  floatVariants: any;
}

const DashboardCard = ({
  title,
  description,
  icon,
  to,
  variants,
  floatVariants,
}: DashboardCardProps) => {
  return (
    <motion.div variants={variants}>
      <Link to={to}>
        <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 transition-all duration-300 overflow-hidden group">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <motion.div
              className="mb-4 p-3 rounded-full bg-gray-700/50 group-hover:bg-gray-600/50 transition-colors duration-300"
              variants={floatVariants}
              animate="float"
            >
              {icon}
            </motion.div>
            <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-blue-300 transition-colors duration-300">
              {title}
            </h3>
            <p className="text-gray-400 mb-4 group-hover:text-gray-300 transition-colors duration-300">
              {description}
            </p>
            <motion.div
              className="text-blue-400 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ y: 10 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <span className="mr-1">Explore</span>
              <ArrowRight className="h-4 w-4" />
            </motion.div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};

export default EDGEAIDashboard;
