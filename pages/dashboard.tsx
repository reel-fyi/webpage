import { Card } from 'flowbite-react';
import Head from 'next/head'

import Header from "../components/Header";

export default function Dashboard() {
    return (
        <div>
          <Head>
            <title>Reel.fyi - Networking Magic for Job Seekers</title>
            <meta name="description" content="Networking Magic for Job Seekers" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
    
          <Header />
          <div className="flex dark:bg-gray-900 min-h-screen">
            <main className="mx-4 mt-4 flex-[1_0_16rem]">
              <div className="flex justify-center">
                Dashboard
              </div>
            </main>
          </div>
        </div>
    );
}