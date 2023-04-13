import { Button, Card, Label, Spinner, Tabs, TextInput } from 'flowbite-react'
import Head from 'next/head'
import PocketBase from 'pocketbase'
import 'cross-fetch/polyfill';
import { useState } from 'react';

import Header from '../components/Header';
import { useRouter } from 'next/router';

const SignupForm = () => {
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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
    // create user
    const record = await pb.collection('users').create(data);
    console.log(record);
    // login user
    const authData = await pb.collection('users').authWithPassword(
      email,
      password
    );
    console.log(authData);
    // redirect to dashboard
    router.push('/dashboard');
  }

  const LoadingSpinner = (
    <div className='flex-row'>
      <Spinner aria-label='Sign up loading spinner' color='purple' size='xl' />
      <span className='pl-3 text-xl'>Signing you up!</span>
    </div>
  );

  const form = (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className='flex mt-2 gap-2'>
        <div className='flex items-center basis-1/2'>
          <div className="mr-2">
            <Label htmlFor="fname">First Name</Label>
          </div>
          <TextInput
            id='fname'
            className='grow'
            type="text"
            placeholder="Richard"
            onChange={(e) => setFname(e.target.value)}
            required
          />
        </div>
        <div className='flex items-center basis-1/2 ml-2'>
          <div className="mr-2">
            <Label htmlFor="lname">Last Name</Label>
          </div>
          <TextInput
            id='lname'
            className="grow"
            type="text"
            placeholder="Bachman"
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
          placeholder="rbachman@stanford.edu"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
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
      <Button type="submit">Sign up</Button>
    </form>
  )

  return isLoading ? LoadingSpinner : form;
};

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const pb = new PocketBase(process.env.NEXT_PUBLIC_API_URL);
    // login user
    const authData = await pb.collection('users').authWithPassword(
      email,
      password
    );
    console.log(authData);
    // redirect to dashboard
    router.push('/dashboard');
  }

  const LoadingSpinner = (
    <div className='flex-row'>
      <Spinner aria-label='Sign up loading spinner' color='purple' size='xl' />
      <span className='pl-3 text-xl'>Logging you in!</span>
    </div>
  );

  const form = (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="email">Email</Label>
        </div>
        <TextInput
          id='email'
          type="email"
          placeholder="rbachman@stanford.edu"
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
      <Button type="submit">Login</Button>
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

export default function Home() {
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
