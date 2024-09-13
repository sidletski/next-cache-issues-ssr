/* eslint-disable @next/next/no-img-element */
import { Form } from "@/components/form";
import { User } from "@/db";
import localFont from "next/font/local";
import Link from "next/link";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function UserSettings({ user }: { user: User }) {
  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]`}
    >
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1>User #{user.id}</h1>
        <Form user={user} />
        <Link href="/" className="text-cyan-700">
          Go back
        </Link>
      </main>
    </div>
  );
}

export const getServerSideProps = async () => {
  const userId = 1;
  const res = await fetch(`http://localhost:3000/api/users/${userId}`);
  const user = await res.json();

  return {
    props: { user },
  };
};
