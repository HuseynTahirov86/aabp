import Script from "next/script";

export function JsonLd({ data }: { data: object }) {
  return (
    <Script
      id="jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
