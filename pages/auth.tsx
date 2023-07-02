import { Card, Tabs, Toast } from 'flowbite-react'
import Head from 'next/head'
import { useEffect, useState } from 'react';
import { HiX } from 'react-icons/hi'
import Header from '../components/Header';
import { useRouter } from 'next/router';
import { SignIn, SignUp } from '@clerk/nextjs';

const ErrorNotification = () => (
  <div className='flex justify-end'>
    <Toast>
      <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
        <HiX className="h-5 w-5" />
      </div>
      <div className="ml-3 text-sm font-normal">
        An error occurred, try again.
      </div>
      <Toast.Toggle />
    </Toast>
  </div>
);

export default function Auth() {
  const router = useRouter();
  const [refFromError, setRefFromError] = useState(false);

  useEffect(() => {
    const path = router.asPath;
    if (path === '/auth?ref=dashboard') {
      setRefFromError(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          {refFromError ? <ErrorNotification /> : null}
          <div className="flex justify-center">
            <Card className="mt-4 mb-4 w-1/2">
              <Tabs.Group aria-label='Auth Tabs' style="underline">
                <Tabs.Item title="Login">
                  <SignIn />
                </Tabs.Item>
                <Tabs.Item title="Signup" active={true}>
                  <SignUp />
                </Tabs.Item>
              </Tabs.Group>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}