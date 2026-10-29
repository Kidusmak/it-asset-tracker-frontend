import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import Shell from "@/components/Shell";

export const metadata = {
  title: "IT Asset Tracker",
  description: "Manage hardware assets and assignments",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Shell>{children}</Shell>
        </AuthProvider>
      </body>
    </html>
  );
}
