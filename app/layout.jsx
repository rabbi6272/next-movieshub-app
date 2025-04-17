import { Nunito, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { Slide, ToastContainer } from "react-toastify";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "MoviesHub || Solution for all your movie needs",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20,400,0,0"
        />
      </head>
      <body
        className={`${nunito.variable} ${inter.variable} antialiased max-h-screen bg-black`}
      >
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
