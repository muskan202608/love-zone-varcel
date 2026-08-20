import Head from "next/head";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { stateSeoPageBySlug } from "../../lib/seo-states";
import { readDatabase } from "../../lib/store";
import type { StateSeoPage } from "../../lib/seo-states";

type Props = {
  state: string;
  title: string;
  description: string;
  keywords: string;
};

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
  const route = String(params?.state || "");
  const slug = route.startsWith("playboy-jobs-") ? route.slice("playboy-jobs-".length) : "";
  const stateSlug = slug as StateSeoPage;
  const state = stateSeoPageBySlug.get(stateSlug);
  if (!state) return { notFound: true };

  const { settings } = await readDatabase();
  const seo = settings.seo[stateSlug];
  return { props: { state: state.name, title: seo.title, description: seo.description, keywords: seo.keywords } };
};

export default function StateSeoPage({ state, title, description, keywords }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  }, [router]);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
      </Head>
      <main aria-live="polite">
        Redirecting from Playboy Jobs in {state}…
        <style jsx>{`
          main {
            display: grid;
            min-height: 100vh;
            place-items: center;
            margin: 0;
            padding: 24px;
            background: #0a0a0a;
            color: #cfcfcf;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 14px;
            text-align: center;
          }
        `}</style>
      </main>
    </>
  );
}
