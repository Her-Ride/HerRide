import Link from "next/link";
import Image from "next/image";
import { UserButton, SignInButton, SignUpButton} from "@clerk/nextjs";

export default function Header( { isSignedIn = false }: { isSignedIn: boolean } ) {
  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center py-[15px] px-6 md:px-[40px] bg-white/85 backdrop-blur-sm">
      <div className="flex items-center gap-[10px]">
        <Link href="/" className="block">
          <Image
            src="/logo.png"
            alt="HerRide Logo"
            width={55}
            height={55}
            className="w-[55px] h-[55px] object-contain select-none"
            draggable={false as any}
          />
        </Link>
        <Link
          href="/"
          className="font-[500] text-[22px] tracking-[0.5px] font-[Aboreto] text-black no-underline"
        >
          HerRide
        </Link>
      </div>
      <div className="flex items-center gap-[25px] sm:ml-auto flex-wrap">
        {isSignedIn ? (<>
          <nav className="flex items-center flex-wrap">
            <Link
              href="/dashboard"
              className="mx-[15px] my-1 font-[500] text-black hover:text-[#4b144b] transition-colors duration-200 font-[Aboreto]"
            >
              Dashboard
            </Link>
            <Link
              href="/rides"
              className="mx-[15px] my-1 font-[500] text-black hover:text-[#4b144b] transition-colors duration-200 font-[Aboreto]"
            >
              My Rides
            </Link>
            <Link
              href="/messages"
              className="mx-[15px] my-1 font-[500] text-black hover:text-[#4b144b] transition-colors duration-200 font-[Aboreto]"
            >
              Messages
            </Link>
            {/* 🆕 Added Profile link */}
            <Link
                href="/profile"
                className="mx-[15px] my-1 font-[500] text-black hover:text-[#4b144b] transition-colors duration-200 font-[Aboreto]"
              >
                Profile
              </Link>
          </nav>
          <div className="ml-2">
            {/* <UserButton 
              userProfileMode="navigation" 
              userProfileUrl="/profile"
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10 rounded-full border border-black/10"
                }
              }}
            /> */}

            <UserButton />

          </div>  
        </>) : (<>
          <nav className="flex items-center flex-wrap">
            <SignInButton>
                    <button className="mx-[15px] my-1 font-[500] text-black hover:text-[#4b144b] transition-colors duration-200 font-[Aboreto]">
                      Log In
                    </button>
            </SignInButton>
            <SignUpButton>
                    <button className="mx-[15px] my-1 font-[500] text-black hover:text-[#4b144b] transition-colors duration-200 font-[Aboreto]">
                      Sign Up
                    </button>
            </SignUpButton>
          </nav>
        </>)}
      </div>
    </header>
  );
}
