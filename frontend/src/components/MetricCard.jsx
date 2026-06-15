import { motion } from "framer-motion";

export default function MetricCard({
  title,
  value
}) {
  return (
    <motion.div
      whileHover={{
        y: -5
      }}
      className="
      bg-zinc-900
      border
      border-zinc-800
      rounded-3xl
      p-8
      "
    >

      <h2 className="text-5xl font-bold">
        {value}
      </h2>

      <p className="mt-3 text-zinc-400">
        {title}
      </p>

    </motion.div>
  );
}