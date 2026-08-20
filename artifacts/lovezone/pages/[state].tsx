import Head from "next/head";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import type { StateSeoPage } from "../lib/seo-states";
import { stateSeoPageBySlug } from "../lib/seo-states";
import { readDatabase } from "../lib/store";

type Props = {
  state: string;
  slug: StateSeoPage;
  title: string;
  description: string;
  keywords: string;
  siteUrl: string;
};

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
  const slug = String(params?.state || "") as StateSeoPage;
  const state = stateSeoPageBySlug.get(slug);
  if (!state) return { notFound: true };

  const { settings } = await readDatabase();
  const seo = settings.seo[slug];
  const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://playboyzone.in").replace(/\/$/, "");
  return { props: { state: state.name, slug, title: seo.title, description: seo.description, keywords: seo.keywords, siteUrl } };
};

export default function StateSeoPage({ state, slug, title, description, keywords, siteUrl }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  useEffect(() => {
    const redirectTimer = window.setTimeout(() => router.replace("/"), 1500);
    return () => window.clearTimeout(redirectTimer);
  }, [router]);

  const canonicalUrl = `${siteUrl}/${slug}`;
  const ogImage = `${siteUrl}/opengraph.jpg`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
      </Head>
      <main aria-live="polite">
        <div className="panel">
          <span>PlayboyZone</span>
          <h1>{title}</h1>
          <p>{description}</p>
          <p className="redirect">Taking you to the homepage…</p>
        </div>
        <style jsx>{`
          main {
            display: grid;
            min-height: 100vh;
            place-items: center;
            margin: 0;
            padding: 24px;
            overflow: hidden;
            background: radial-gradient(35rem 24rem at 50% 0%, rgba(180, 0, 12, .32), transparent 72%), #0a0a0a;
            color: #ffffff;
            font-family: Arial, Helvetica, sans-serif;
            text-align: center;
          }
          .panel {
            width: min(100%, 620px);
            border: 1px solid rgba(255, 255, 255, .11);
            border-radius: 24px;
            background: rgba(255, 255, 255, .035);
            padding: clamp(28px, 7vw, 52px);
            box-shadow: 0 28px 70px rgba(0, 0, 0, .36);
          }
          span {
            color: #ff2b35;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: .16em;
            text-transform: uppercase;
          }
          h1 { margin: 16px 0 0; font-size: clamp(26px, 6vw, 42px); letter-spacing: -.04em; line-height: 1.08; }
          p { margin: 18px auto 0; max-width: 520px; color: #b6b6b6; font-size: 15px; line-height: 1.7; }
          .redirect { color: #ff9298; font-size: 13px; }
        `}</style>
      </main>
    </>
  );
}
