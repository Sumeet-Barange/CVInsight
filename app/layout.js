import "./globals.css";
import Navbar from "@/components/Navbar";
import Provider from "@/components/Provider";

export const metadata = {
  title: "CVInsight",
  description: "AI-powered resume analysis",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* ADD suppressHydrationWarning HERE 👇 */}
      <body suppressHydrationWarning className="bg-gray-50">
        <Provider>
          <Navbar />
          <main>{children}</main>
        </Provider>
      </body>
    </html>
  );
}