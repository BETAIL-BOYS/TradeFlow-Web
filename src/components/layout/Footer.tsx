import React from "react";

export default function Footer() {
  return (
    <footer className="bg-slate-800 border-t border-slate-700 py-8 px-8 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-slate-400 text-sm">
            © 2024 TradeFlow. All rights reserved.
          </div>
          <nav className="flex gap-6">
            <a
              href="#"
              className="text-slate-400 hover:text-white transition-colors text-sm"
              onClick={(e) => {
                e.preventDefault();
                // Handle Documentation link
                console.log("Documentation clicked");
              }}
            >
              Documentation
            </a>
            <a
              href="#"
              className="text-slate-400 hover:text-white transition-colors text-sm"
              onClick={(e) => {
                e.preventDefault();
                // Handle Terms of Service link
                console.log("Terms of Service clicked");
              }}
            >
              Terms of Service
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors text-sm"
            >
              Twitter
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
