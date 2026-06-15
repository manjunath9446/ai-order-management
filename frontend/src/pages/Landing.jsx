import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import MetricCard from "../components/MetricCard";
import PlatformPreview from "../components/PlatformPreview";
import CopilotPreview from "../components/CopilotPreview";

export default function Landing() {
return ( <div className="min-h-screen bg-black text-white relative overflow-hidden">

```
  {/* Background Glow */}
  <div className="absolute inset-0 pointer-events-none">
    <div
      className="
      absolute
      top-20
      left-1/2
      -translate-x-1/2
      w-[1000px]
      h-[1000px]
      rounded-full
      bg-white/[0.03]
      blur-[180px]
      "
    />
  </div>

  <Navbar />

  {/* HERO */}
  <section className="h-screen flex items-center justify-center px-6">

    <motion.div
      initial={{
        opacity: 0,
        y: 40
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      transition={{
        duration: 1
      }}
      className="text-center max-w-6xl"
    >

      <p
        className="
        uppercase
        tracking-[0.45em]
        text-zinc-500
        mb-8
        "
      >
        AI OPERATIONS PLATFORM
      </p>

      <h1
        className="
        text-6xl
        md:text-8xl
        font-bold
        leading-tight
        "
      >
        Predict Delays.
        <br />
        Prevent Failures.
        <br />
        Optimize Operations.
      </h1>

      <p
        className="
        mt-10
        text-zinc-400
        text-lg
        md:text-xl
        max-w-3xl
        mx-auto
        "
      >
        AI-powered order management,
        risk prediction,
        operational intelligence,
        and autonomous actions.
      </p>

      <Link to="/dashboard">
        <button
          className="
          mt-10
          px-10
          py-4
          rounded-full
          bg-white
          text-black
          font-semibold
          hover:scale-105
          transition
          "
        >
          Launch Control Center
        </button>
      </Link>

    </motion.div>

  </section>

  {/* METRICS */}

  <section
    id="metrics"
    className="
    py-24
    px-8
    max-w-7xl
    mx-auto
    "
  >

    <div className="mb-12">

      <h2 className="text-5xl font-bold">
        Operations Overview
      </h2>

      <p className="text-zinc-400 mt-4">
        Real-time AI-driven operational insights
      </p>

    </div>

    <div
      className="
      grid
      grid-cols-1
      md:grid-cols-2
      lg:grid-cols-4
      gap-6
      "
    >

      <MetricCard
        title="Orders"
        value="20"
      />

      <MetricCard
        title="High Risk"
        value="15"
      />

      <MetricCard
        title="Alerts"
        value="10"
      />

      <MetricCard
        title="AI Decisions"
        value="32"
      />

    </div>

  </section>

  {/* PLATFORM PREVIEW */}

  <PlatformPreview />

  {/* FEATURES */}

  <section
    id="features"
    className="
    py-24
    px-8
    max-w-7xl
    mx-auto
    "
  >

    <div className="mb-16">

      <h2 className="text-5xl font-bold">
        AI Intelligence Layer
      </h2>

      <p className="text-zinc-400 mt-4">
        Core AI capabilities powering autonomous operations.
      </p>

    </div>

    <div
      className="
      grid
      md:grid-cols-3
      gap-8
      "
    >

      <div
        className="
        bg-zinc-900
        p-8
        rounded-3xl
        border
        border-zinc-800
        "
      >
        <h3 className="text-2xl font-semibold mb-4">
          Delay Prediction
        </h3>

        <p className="text-zinc-400">
          Predict SLA breaches before they happen using machine learning.
        </p>
      </div>

      <div
        className="
        bg-zinc-900
        p-8
        rounded-3xl
        border
        border-zinc-800
        "
      >
        <h3 className="text-2xl font-semibold mb-4">
          Root Cause Analysis
        </h3>

        <p className="text-zinc-400">
          AI identifies bottlenecks and operational failures automatically.
        </p>
      </div>

      <div
        className="
        bg-zinc-900
        p-8
        rounded-3xl
        border
        border-zinc-800
        "
      >
        <h3 className="text-2xl font-semibold mb-4">
          AI Copilot
        </h3>

        <p className="text-zinc-400">
          Ask natural language questions and get operational insights instantly.
        </p>
      </div>

    </div>

  </section>

  {/* LIVE COPILOT */}

  <CopilotPreview />

  {/* CTA */}

  <section
    className="
    py-32
    px-8
    text-center
    max-w-5xl
    mx-auto
    "
  >

    <p
      className="
      uppercase
      tracking-[0.35em]
      text-zinc-500
      mb-6
      "
    >
      READY TO DEPLOY
    </p>

    <h2
      className="
      text-5xl
      md:text-7xl
      font-bold
      "
    >
      Autonomous
      <br />
      AI Operations
    </h2>

    <p
      className="
      mt-8
      text-zinc-400
      text-xl
      "
    >
      Manage orders,
      predict risks,
      generate alerts,
      and automate decisions.
    </p>
    

    <Link to="/dashboard">
      <button
        className="
        mt-10
        px-10
        py-4
        rounded-full
        bg-white
        text-black
        font-semibold
        hover:scale-105
        transition
        "
      >
        Get Started
      </button>
    </Link>

  </section>

</div>

);
}
