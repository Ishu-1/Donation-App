import { FaFacebookF, FaInstagram, FaTwitter, FaPinterestP } from "react-icons/fa";

export default function DonationFooter() {
  return (
    <footer className="bg-[#f9f9f6] border-t border-gray-300 text-[#2a3c4e]">
      {/* Top Image Section */}
      <div className="px-8 py-6">
        <h2 className="text-4xl font-serif mb-4">Follow Us</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((img, idx) => (
            <div
              key={idx}
              className="h-32 w-full rounded-md"
              style={{
                backgroundImage: `url(/${img}.jpg)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          ))}
        </div>
      </div>

      {/* Middle Section */}
      <div className="border-t border-b border-gray-300 px-8 py-8 md:flex md:justify-between md:items-start space-y-6 md:space-y-0">
        {/* Branding */}
        <div className="text-2xl font-serif font-semibold">DoNation</div>

        {/* Newsletter */}
        <div className="flex flex-col space-y-2 max-w-sm">
          <p className="text-lg font-medium">Subscribe to Our Newsletter</p>
          <div className="flex">
            <input
              type="email"
              placeholder="Enter Your Email Here *"
              className="border border-gray-400 px-3 py-2 rounded-l-md w-full focus:outline-none"
            />
            <button className="bg-white border border-gray-400 px-4 py-2 rounded-r-md hover:bg-gray-100 cursor-pointer">
              Join
            </button>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <input type="checkbox" id="subscribe" />
            <label htmlFor="subscribe">Yes, Subscribe me to newsletter</label>
          </div>
          <span className="text-sm text-blue-700 hover:underline cursor-pointer">
            Contact Us Today
          </span>
        </div>

        {/* Contact Info */}
        <div className="text-sm space-y-2">
          <p>123-456-7890</p>
          <p>info@mysite.com</p>
          <p>
            500 Terry Francine Street,
            <br />
            6th Floor, San Francisco, CA 94158
          </p>
          <div className="flex space-x-4 text-lg mt-2">
            <FaFacebookF className="cursor-pointer hover:text-blue-600" />
            <FaInstagram className="cursor-pointer hover:text-pink-600" />
            <FaTwitter className="cursor-pointer hover:text-blue-400" />
            <FaPinterestP className="cursor-pointer hover:text-red-500" />
          </div>
        </div>

        {/* Links */}
        <div className="text-sm space-y-2 text-right">
          <p className="hover:underline cursor-pointer">Privacy Policy</p>
          <p className="hover:underline cursor-pointer">Accessibility Statement</p>
          <p className="hover:underline cursor-pointer">Terms & Conditions</p>
          <p className="hover:underline cursor-pointer">Refund Policy</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="text-center text-sm py-4 border-t border-gray-300 text-gray-600">
        © 2035 by DoNation. Powered and secured by{" "}
        <span className="underline cursor-pointer">Wix</span>
      </div>
    </footer>
  );
}
