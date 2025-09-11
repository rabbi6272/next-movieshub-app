import { Nunito, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { Slide, ToastContainer } from "react-toastify";

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
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20,400,0,0"
        />
      </head>
      <body className={`${nunito.className} antialiased max-h-screen bg-black`}>
        <ToastContainer
          position="bottom-center"
          autoClose={1500}
          hideProgressBar={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover={false}
          theme="dark"
          transition={Slide}
        />
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
