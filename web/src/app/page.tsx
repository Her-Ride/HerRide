import Link from "next/link";

export default function Home() {
  return (
    <div
      className="landing-page"
      style={{ backgroundImage: 'url(/background.png)' }}
    >
      <main className="landing-content">
        <h1>
          CARPOOLING <br /> MADE FOR WOMEN
        </h1>
        <p>Safety for women, serenity for the world.</p>
        <div className="button-group">
          <button className="primary-btn">PLAN A RIDE</button>
          <Link href="/learn-more">
            <button className="secondary-btn">LEARN MORE</button>
          </Link>
        </div>
      </main>
    </div>
  );
}
