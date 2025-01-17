import { Metadata } from "next";

export function generateMetadata(): Metadata {
  const title = "색상 스펙트럼 추출기";
  const description =
    "색깔을 선택하면 반사 스펙트럼 그래프를 보여줍니다. 반사 스펙트럼은 머신러닝 모델을 활용해 생성됩니다.";

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
