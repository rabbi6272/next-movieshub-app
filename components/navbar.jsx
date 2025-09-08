import localFont from "next/font/local";
import Link from "next/link";

const ttTrailers = localFont({
  src: "../app/fonts/TT Trailers Trial ExtraBold Italic.ttf",
  display: "swap",
  style: "italic",
  weight: "800",
});
export default function Navbar() {
  return (
    <nav className="sticky top-0 z-20 bg-[#0b6e99] h-[60px] w-full flex items-center justify-between px-4 md:px-8 lg:px-10">
      <h1
        className={`${ttTrailers.className} italic font-extrabold text-gray-300 text-3xl`}
      >
        MoviesHub
      </h1>
      <div className="flex items-center gap-6 lg:gap-8">
        <Link className="hover:text-blue-400 transition-colors" href="/">
          Home
        </Link>
        <Link className="hover:text-blue-400 transition-colors" href="/movies">
          Movies
        </Link>
      </div>
    </nav>
  );
}
