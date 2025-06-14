import { useState } from "react";

function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subscribing with email:", email);
    alert(`Subscribing ${email} to newsletter!`); 
    setEmail('');
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 text-sm">
        <div>
          <h3 className="font-semibold text-lg mb-4 text-gray-200">Solutions</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Marketing</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Analytics</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Automation</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Commerce</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Insights</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Support</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-4 text-gray-200">Documentation</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Submit ticket</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Documentation</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Guides</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-4 text-gray-200">Company</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">About</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Blog</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Jobs</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Press</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Legal</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Terms of service</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Privacy policy</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">License</a></li>
          </ul>
        </div>

        <div className="md:col-span-1"> 
          <h3 className="font-semibold text-lg mb-4 text-gray-200">Subscribe to our newsletter</h3>
          <p className="text-gray-400 mb-4">The latest news, articles, and resources, sent to your inbox weekly.</p>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="Email address"
              className="p-2 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-500 text-xs">
        © 2025 Your Company. All rights reserved. (Placeholder)
      </div>
    </div>
  );
}

export default Footer;
