import React from "react";

const Footer = () => {
  const services = [
    "Any Country Work Visa",
    "Visit Visa",
    "Family Visa",
    "Hajj Processing",
    "Air Ticketing",
  ];

  return (
    <footer className="bg-gradient-to-r from-blue-600 to-indigo-800 text-gray-100 px-4 sm:px-6 py-10 mt-10">
      {/* Scrolling Notice */}
      <div className="overflow-hidden border-b border-white/20 pb-3 mb-8">
        <div className="flex whitespace-nowrap gap-12 animate-marquee hover:[animation-play-state:paused] text-xs sm:text-sm md:text-base">
          <span>
            For assistance with payment approvals and slip cancellations, please
            contact us at: 📞 01629412410 🔄
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 text-center md:text-left">
        {/* Founder */}
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-white">
            MOHHAMMAD RABBI
          </h2>
          <hr className="border-white/30 my-3 w-20 mx-auto md:mx-0" />
          <p className="text-sm text-gray-200">Founder & Consultant</p>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-base md:text-lg font-semibold mb-3">
            Contact Information
          </h3>
          <ul className="space-y-2 text-sm text-gray-200">
            <li>
              📞{" "}
              <a href="tel:+8801629412410" className="hover:text-white">
                +8801629412410
              </a>
            </li>
            <li>
              ✉️{" "}
              <a
                href="mailto:msgoodlucktourstravels@gmail.com"
                className="hover:text-white break-all"
              >
                msgoodlucktourstravels@gmail.com
              </a>
            </li>
            <li className="leading-relaxed">
              📍 China Town (5th Floor), Room No. W-5/67, Naya Paltan,
              Dhaka-1000, Bangladesh
            </li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-base md:text-lg font-semibold mb-3">
            Our Services
          </h3>
          <ul className="text-sm text-gray-200 space-y-1">
            {services.map((service, index) => (
              <li key={index}>• {service}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/30 mt-8 pt-4 text-center text-xs sm:text-sm text-gray-200">
        © {new Date().getFullYear()} All Rights Reserved
      </div>

      {/* Animation */}
      <style>
        {`
          .animate-marquee {
            animation: marquee 7s linear infinite;
          }

          @media (max-width: 640px) {
            .animate-marquee {
              animation-duration: 7s;
            }
          }

          @keyframes marquee {
            0% {
              transform: translateX(0%);
            }
            100% {
              transform: translateX(-100%);
            }
          }
        `}
      </style>
    </footer>
  );
};

export default Footer;
