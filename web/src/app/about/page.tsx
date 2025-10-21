import { CircleOff, Lightbulb, Earth } from "lucide-react";

export default function AboutPage() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex justify-center items-center px-4 py-12"
      style={{ backgroundImage: "url(/background.png)" }}
    >
      <div className="w-[90%] max-w-3xl bg-black/60 text-white p-8 md:p-12 rounded-2xl shadow-2xl text-center">
        <h1 className="font-[Aboreto] text-3xl md:text-4xl mb-10 tracking-wider">
          ABOUT US – HERRIDE
        </h1>

        <div className="flex flex-col gap-8">
          {/* WHY WE EXIST */}
          <div className="flex items-start gap-4 text-left">
            <CircleOff className="text-pink-300 mt-1 shrink-0" size={40} />
            <div>
              <h2 className="font-[Aboreto] text-xl mb-1">WHY WE EXIST</h2>
              <p className="font-[Aboreto] text-sm md:text-base leading-relaxed text-gray-200">
                Commuting can often feel unsafe, expensive, and isolating for
                women. Many hesitate to share rides with strangers because trust
                and safety aren’t guaranteed.
              </p>
            </div>
          </div>

          {/* WHAT WE BUILT */}
          <div className="flex items-start gap-4 text-left">
            <Lightbulb className="text-pink-300 mt-1 shrink-0" size={40} />
            <div>
              <h2 className="font-[Aboreto] text-xl mb-1">WHAT WE BUILT</h2>
              <p className="font-[Aboreto] text-sm md:text-base leading-relaxed text-gray-200">
                HerRide was created to make travel safe, simple, and
                community-driven. Using Firebase login, Google Maps route
                matching, ride requests, and secure messaging, women can easily
                find and join rides with others heading the same way.
              </p>
            </div>
          </div>

          {/* OUR VISION */}
          <div className="flex items-start gap-4 text-left">
            <Earth className="text-pink-300 mt-1 shrink-0" size={40} />
            <div>
              <h2 className="font-[Aboreto] text-xl mb-1">OUR VISION</h2>
              <p className="font-[Aboreto] text-sm md:text-base leading-relaxed text-gray-200">
                More than just a carpooling app, HerRide is about empowerment
                and connection. Women save money, reduce environmental impact,
                and most importantly, build a trusted network of commuters who
                look out for each other.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
