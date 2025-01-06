import { Metadata } from "next";

export function generateMetadata(): Metadata {
  const title = "Image Converter";
  const description =
    "Easily convert images online in the simplest way. Supports conversion to JPEG, PNG, and WEBP formats.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "en",
      siteName: "Simple ToolBox",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
