import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-50 py-12 px-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-4">

          <div className="col-span-2">
            <div className="flex items-center gap-[10px]">
              <Image
                src="/logo.png"
                alt="HerRide Logo"
                width={40}
                height={40}
                className="w-[40px] h-[40px] object-contain"
              />
              <span className="font-[500] text-[20px] tracking-[0.5px] font-[Aboreto] text-[#4b144b]">
                HerRide
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-gray-900 mb-4 font-[Aboreto]">Navigate</h3>
            <nav className="space-y-2">
              <Link href="/" className="block text-gray-600 hover:text-[#4b144b] text-sm transition-colors">
                Home
              </Link>
              <Link href="/dashboard" className="block text-gray-600 hover:text-[#4b144b] text-sm transition-colors">
                Dashboard
              </Link>
              <Link href="/rides" className="block text-gray-600 hover:text-[#4b144b] text-sm transition-colors">
                My Rides
              </Link>
              <Link href="/messages" className="block text-gray-600 hover:text-[#4b144b] text-sm transition-colors">
                Messages
              </Link>
              <Link href="/profile" className="block text-gray-600 hover:text-[#4b144b] text-sm transition-colors">
                Account
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="text-gray-900 mb-4 font-[Aboreto]">Learn More</h3>
            <nav className="space-y-2">
              <Link href="/about" className="block text-gray-600 hover:text-[#4b144b] text-sm transition-colors">
                About HerRide
              </Link>
              <Link href="/contact" className="block text-gray-600 hover:text-[#4b144b] text-sm transition-colors">
                Contact Us
              </Link>
            </nav>
          </div>
        </div>

        <div className="border-t border-gray-400 mt-8 pt-6">
          <p className="text-center text-gray-500 text-sm">
            © 2025 HerRide | All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
