import Link from "next/link";

export default function Home() {
  return (
    <div
      className="landing-page"
      style={{ backgroundImage: 'url(/background.png)' }}
    >
      <main className="landing-content text-center">
        <h1>
          CARPOOLING <br /> MADE FOR WOMEN
        </h1>

        <p>Safety for women, serenity for the world.</p>

        <div className="button-group flex justify-center gap-6 mt-8">
          {/* PLAN A RIDE button (no action yet) */}
          <button
            className="primary-btn bg-purple-900 text-white px-8 py-3 rounded-md font-[Aboreto] hover:opacity-90 transition"
            onClick={() => {}} // does nothing for now
          >
            PLAN A RIDE
          </button>

          {/* LEARN MORE button (works) */}
          <Link href="/learn-more">
            <button className="secondary-btn">
              LEARN MORE
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
