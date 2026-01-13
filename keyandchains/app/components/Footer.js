import React from "react";
import { Github, Laptop, Rocket, Zap } from "lucide-react";

const Footer = () => {
  return (
    <section className="mt-auto bg-transparent">
      <footer className="border-t border-gray-300 py-6 flex flex-col items-center gap-3">

        {/* TOP: ICONS */}
        <div className="flex items-center gap-4 text-gray-600">
          <Zap size={18} />
          <Laptop size={18} />

          <a
            href="https://github.com/ShahanwazSaddam144/Key---Chains"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hover:opacity-80 transition"
          >
            <Github size={18} />
          </a>

          <Rocket size={18} />
        </div>

        {/* BOTTOM: TEXT */}
        <p className="text-sm text-gray-600 text-center">
          © 2026 · Powered by Butt Networks
        </p>

      </footer>
    </section>
  );
};

export default Footer;
