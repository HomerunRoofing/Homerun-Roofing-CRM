import "./globals.css";

export const metadata = {
  title: "Home Run Roofing CRM",
  description: "Home Run Roofing CRM prototype",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}