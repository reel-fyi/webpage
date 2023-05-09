import { Alert, Button, Card, Label, Spinner, Tabs, TextInput, Toast } from 'flowbite-react'
import Head from 'next/head'
import PocketBase from 'pocketbase'
import 'cross-fetch/polyfill';
import { useEffect, useState } from 'react';
import { HiX, HiInformationCircle } from 'react-icons/hi'
import Header from '../components/Header';
import { useRouter } from 'next/router';
import mixpanel from 'mixpanel-browser';

const SignupForm = () => {
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyticsEnabled, setIsAnalyticsEnabled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
    if (token) {
      mixpanel.init(token);
      setIsAnalyticsEnabled(true);
    }
  }, []);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const pb = new PocketBase(process.env.NEXT_PUBLIC_API_URL);
    const data = {
      name: fname + ' ' + lname,
      password,
      passwordConfirm: password,
      email,
    };
    try {
      // create user
      const record = await pb.collection('users').create(data);
      console.log(record);
      // login user
      const authData = await pb.collection('users').authWithPassword(
        email,
        password
      );
      console.log(authData);
      // track user signup
      if (isAnalyticsEnabled) {
        mixpanel.identify(record.id);
        mixpanel.track('dashboard_sign_up');
      }
      localStorage.removeItem('first_reel_sent');
      // redirect to dashboard
      router.push('/dashboard?ref=signup');
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  }

  const LoadingSpinner = (
    <div className='flex-row'>
      <Spinner aria-label='Sign up loading spinner' color='purple' size='xl' />
      <span className='pl-3 text-xl'>Signing you up!</span>
    </div>
  );

  const form = (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className='flex mt-2 justify-between'>
        <div className='flex flex-col gap-y-2 basis-[47%]'>
          <div className="mr-2">
            <Label htmlFor="fname">First Name</Label>
          </div>
          <TextInput
            id='fname'
            className='grow'
            type="text"
            placeholder="First Name"
            onChange={(e) => setFname(e.target.value)}
            required
          />
        </div>
        <div className='flex flex-col gap-y-2 basis-[47%]'>
          <div className="mr-2">
            <Label htmlFor="lname">Last Name</Label>
          </div>
          <TextInput
            id='lname'
            className="grow"
            type="text"
            placeholder="Last Name"
            onChange={(e) => setLname(e.target.value)}
            required
          />
        </div>
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="email">Email</Label>
        </div>
        <TextInput
          id='email'
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className='mb-2'>
        <div className="mb-2 block">
          <Label htmlFor="password">Password</Label>
        </div>
        <TextInput
          id='password'
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required />
      </div>
      <Button type="submit" color="purple">Sign up</Button>
    </form>
  )

  return isLoading ? LoadingSpinner : form;
};

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const pb = new PocketBase(process.env.NEXT_PUBLIC_API_URL);
    // login user
    try {
      const authData = await pb.collection('users').authWithPassword(
        email,
        password
      );
      console.log(authData);
      // redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      setError(true);
    }
  }

  const LoadingSpinner = (
    <div className='flex-row'>
      <Spinner aria-label='Sign up loading spinner' color='purple' size='xl' />
      <span className='pl-3 text-xl'>Logging you in!</span>
    </div>
  );

  const ErrorNotification = (
    <Alert
      color="failure"
      icon={HiInformationCircle}
    >
      <span>
        <span className="font-medium text-md">
          Invalid email or password!
        </span>
        {' '}Please try again.
      </span>
    </Alert>
  );

  const form = (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      {error && ErrorNotification}
      <div>
        <div className="mb-2 block">
          <Label htmlFor="email">Email</Label>
        </div>
        <TextInput
          id='login-email'
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="login-password">Password</Label>
        </div>
        <TextInput
          id='login-password'
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required />
      </div>
      <Button type="submit" color="purple">Login</Button>
    </form>
  );

  return isLoading ? LoadingSpinner : form;
};

const Login = () => {
  return (
    <section>
      <header>
        <h2 className="mb-4 text-2xl dark:text-gray-200">
          Welcome back
        </h2>
        <LoginForm />
      </header>
    </section>
  )
}

const Signup = () => {
  return (
    <section>
      <header>
        <h2 className="mb-4 text-2xl dark:text-gray-200">
          Get started with Reel.fyi
        </h2>
        <SignupForm />
      </header>
    </section>
  )
}

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
                  <Login />
                </Tabs.Item>
                <Tabs.Item title="Signup" active={true}>
                  <Signup />
                </Tabs.Item>
              </Tabs.Group>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
