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
    <footer className="bg-gradient-to-r from-blue-600 to-indigo-800 text-gray-100 px-6 py-12 mt-10">
      
      {/* Scrolling Notice */}
      <div className="overflow-hidden border-b border-white/20 pb-3 mb-8">
        <div className="flex whitespace-nowrap gap-16 animate-marquee hover:[animation-play-state:paused] text-sm md:text-base">
          <span>
            For assistance with payment approvals and slip cancellations, please
            contact us at: 📞 01629412410 🔄
          </span>
          <span>
            সৌদি আরব, কুয়েত, কাতার, ওমান, বাহরাইন সহ বিভিন্ন দেশের ভিসা প্রসেসিং ও
            টিকেটিং এর নির্ভরযোগ্য প্রতিষ্ঠান।
          </span>
          {/* Duplicate for seamless loop */}
          <span>
            For assistance with payment approvals and slip cancellations, please
            contact us at: 📞 01629412410 🔄
          </span>
          <span>
            সৌদি আরব, কুয়েত, কাতার, ওমান, বাহরাইন সহ বিভিন্ন দেশের ভিসা প্রসেসিং ও
            টিকেটিং এর নির্ভরযোগ্য প্রতিষ্ঠান।
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Founder */}
        <div>
          <h2 className="text-2xl font-semibold text-white">
            MOHHAMMAD RABBI
          </h2>
          <hr className="border-white/30 my-3 w-24" />
          <p className="text-sm text-gray-200">Founder & Consultant</p>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
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
                className="hover:text-white"
              >
                msgoodlucktourstravels@gmail.com
              </a>
            </li>
            <li>
              📍 China Town (5th Floor), Room No. W-5/67, Naya Paltan,
              Dhaka-1000, Bangladesh
            </li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Our Services</h3>
          <ul className="text-sm text-gray-200 space-y-1">
            {services.map((service, index) => (
              <li key={index}>• {service}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/30 mt-10 pt-4 text-center text-sm text-gray-200">
        © {new Date().getFullYear()} All Rights Reserved
      </div>

      {/* Animation */}
      <style>
        {`
          .animate-marquee {
            animation: marquee 8s linear infinite;
          }

          @keyframes marquee {
            0% {
              transform: translateX(0%);
            }
            100% {
              transform: translateX(-50%);
            }
          }
        `}
      </style>
    </footer>
  );
};

export default Footer;
