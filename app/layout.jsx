import { Nunito, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { Toaster } from "react-hot-toast";
import Link from "next/link";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

export const metadata = {
  title: "MoviesHub || Solution for all your movie needs",
  description: "All your favorite movies in one place",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="All your favorite movies in one place"
        />
        <meta
          name="keywords"
          content="movies, streaming, watch, films, cinema, online"
        />
        <meta name="author" content="MoviesHub" />
        <title>MoviesHub || Solution for all your movie needs</title>
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://movieshub.example.com/" />
        <meta
          property="og:title"
          content="MoviesHub || Solution for all your movie needs"
        />
        <meta
          property="og:description"
          content="All your favorite movies in one place"
        />
        <meta property="og:image" content="/icon.png" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://movieshub.example.com/" />
        <meta
          name="twitter:title"
          content="MoviesHub || Solution for all your movie needs"
        />
        <meta
          name="twitter:description"
          content="All your favorite movies in one place"
        />
        <meta name="twitter:image" content="/icon.png" />
        <link rel="icon" href="/icon.png" />

        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        />
        <script src="https://cdn.lordicon.com/lordicon.js" defer></script>
      </head>
      <body
        className={`${nunito.className} antialiased min-h-screen bg-gray-50 text-gray-600`}
      >
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 1500,
          }}
        />
        <Navbar />
        <main className="min-h-[calc(100vh-70px-32px)]">{children}</main>

        <footer>
          <p className="text-sm text-gray-500 text-center pb-3">
            Developed with ❤️ by{" "}
            <Link
              href={"https://github.com/rabbi6272"}
              target="_blank"
              className="hover:underline"
            >
              {" "}
              Rabbi
            </Link>
          </p>
        </footer>
      </body>
    </html>
  );
}
