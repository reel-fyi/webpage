import { Button, Card, DarkThemeToggle, Label, Navbar, Textarea, TextInput } from 'flowbite-react'
import Head from 'next/head'
import Image from 'next/image'

const SignupForm = () => {
  return (
    <form className="flex flex-col gap-4">
      <div>
        <div className="mb-2 block">
          <Label htmlFor="name">Name</Label>
        </div>
        <TextInput
          id='name'
          type="text"
          placeholder="Richard Hendricks"
          required
        />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="bio">Short Bio</Label>
        </div>
        <Textarea
          id='bio'
          style={{ minHeight: '200px' }}
          minLength={100}
          placeholder="I'm Richard Hendricks, the founder and CEOof Pied Piper,
                      a start-up company that develops a revolutionary data
                      compression algorithm. Before starting Pied Piper, I 
                      attended Stanford University but left to pursue my own company.
                      I also worked as a software engineer for Hooli, a tech giant in
                      Silicon Valley. Now, I'm seeking investors who are enthusiastic
                      about cutting-edge technology and want to help Pied Piper thrive."
          required
        />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="email">Email</Label>
        </div>
        <TextInput
          id='email'
          type="email"
          placeholder="richard@piedpiper.com"
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
          placeholder="my password is bachmanity"
          required />
      </div>
      <Button type="submit">Start Reeling!</Button>
    </form>
  );
};

const LoginForm = () => {
  return (
    <form className="flex flex-col gap-4">
      <div>
        <div className="mb-2 block">
          <Label htmlFor="email">Email</Label>
        </div>
        <TextInput
          id='email'
          type="email"
          placeholder="richard@piedpiper.com"
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
          placeholder="my password is bachmanity"
          required />
      </div>
      <Button type="submit">Start Reeling!</Button>
    </form>
  );
};

const Header = () => {
  return (
    <header className="top-0 stick z-20">
      <Navbar fluid>
        <Navbar.Brand href="https://reel.fyi">
          <Image
            alt="Reel.fyi Logo"
            height="48"
            src="/logo.png"
            width="48"
          />
          <span className="self-center whitespace-nowrap px-3 text-2xl font-semibold dark:text-white">Reel.fyi</span>
        </Navbar.Brand>
        <div className="flex md:order-2">
          <DarkThemeToggle />
        </div>
      </Navbar>
    </header>
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
      <div className="flex dark:bg-gray-900 h-screen">
        <main className="mx-4 mt-2 flex-[1_0_16rem]">
          <div className="flex justify-center">
            <Card className="mt-4 p-2 w-1/2">
              <section>
                <header>
                  <h2 className="mb-3 text-4xl dark:text-gray-200">
                    Tell me about yourself
                  </h2>
                  <SignupForm />
                </header>
              </section>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
