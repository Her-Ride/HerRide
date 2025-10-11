import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import profileDefault from "../assets/profile_default.png";

const Header: React.FC = () => {
    return (
        <header
            className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center py-[15px] px-6 md:px-[40px] bg-white/85 backdrop-blur-sm"
        >
            <div className="flex items-center gap-[10px]">
                <Link to="/" className="block">
                    <img
                        src={logo}
                        alt="HerRide Logo"
                        className="w-[55px] h-[55px] object-contain select-none"
                        draggable={false}
                    />
                </Link>
                <Link
                    to="/"
                    className="font-[500] text-[22px] tracking-[0.5px] font-[Aboreto] text-black no-underline"
                >
                    HerRide
                </Link>
            </div>
            <div className="flex items-center gap-[25px] sm:ml-auto flex-wrap">
                <nav className="flex items-center flex-wrap">
                    <Link
                        to="/dashboard"
                        className="mx-[15px] my-1 font-[500] text-black hover:text-[#4b144b] transition-colors duration-200 font-[Aboreto]"
                    >
                        Dashboard
                    </Link>
                    <Link
                        to="/rides"
                        className="mx-[15px] my-1 font-[500] text-black hover:text-[#4b144b] transition-colors duration-200 font-[Aboreto]"
                    >
                        My Rides
                    </Link>
                    <Link
                        to="/messages"
                        className="mx-[15px] my-1 font-[500] text-black hover:text-[#4b144b] transition-colors duration-200 font-[Aboreto]"
                    >
                        Messages
                    </Link>
                </nav>
                <div className="ml-2">
                    <Link to="/profile" aria-label="Profile" className="inline-block rounded-full">
                        <img
                          src={profileDefault}
                          className="w-10 h-10 rounded-full object-cover border border-black/10"
                          draggable={false}
                        />
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
