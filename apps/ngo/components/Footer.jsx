import { FaFacebookF, FaInstagram, FaTwitter, FaPinterestP } from "react-icons/fa";

export default function NgoFooter() {
  return (
    <footer className="bg-[#f9f9f6] border-t border-gray-300 text-[#2a3c4e]">
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

      <div className="border-t border-b border-gray-300 px-8 py-8 md:flex md:justify-between md:items-start space-y-6 md:space-y-0">
        <div className="text-2xl font-serif font-semibold">DoNation Beneficiaries</div>

        <div className="flex flex-col space-y-2 max-w-sm">
          <p className="text-lg font-medium">Stay Updated</p>
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
            <label htmlFor="subscribe">Yes, Subscribe me to updates</label>
          </div>
          <span className="text-sm text-blue-700 hover:underline cursor-pointer">
            Contact Our Team
          </span>
        </div>

        <div className="text-sm space-y-2">
          <p>123-456-7890</p>
          <p>beneficiaries@donation.org</p>
          <p>
            789 Kindness Lane,<br /> 4th Floor, New Delhi, India
          </p>
          <div className="flex space-x-4 text-lg mt-2">
            <FaFacebookF className="cursor-pointer hover:text-blue-600" />
            <FaInstagram className="cursor-pointer hover:text-pink-600" />
            <FaTwitter className="cursor-pointer hover:text-blue-400" />
            <FaPinterestP className="cursor-pointer hover:text-red-500" />
          </div>
        </div>

        <div className="text-sm space-y-2 text-right">
          <p className="hover:underline cursor-pointer">Privacy Policy</p>
          <p className="hover:underline cursor-pointer">Terms of Use</p>
          <p className="hover:underline cursor-pointer">Support</p>
          <p className="hover:underline cursor-pointer">Site Map</p>
        </div>
      </div>

      <div className="text-center text-sm py-4 border-t border-gray-300 text-gray-600">
        © 2035 by DoNation Beneficiaries. Empowered by Impact.
      </div>
    </footer>
  );
}
