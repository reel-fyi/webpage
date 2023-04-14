import { Accordion, Button, Card, Textarea, Toast } from 'flowbite-react';
import Head from 'next/head'
import { useEffect, useState } from 'react';
import { AiFillCheckCircle, AiOutlineCheckCircle } from 'react-icons/ai';
import { HiCheck } from 'react-icons/hi'
import PocketBase, { type Record } from 'pocketbase';

import Header from "../components/Header";
import { useRouter } from 'next/router';

const CompleteCheckIcon = () => (
  <AiFillCheckCircle className='mr-2 text-purple-700' size={32} />
);

const IncompleteCheckIcon = () => (
  <AiOutlineCheckCircle className='mr-2 text-purple-700' size={32} />
);

const SavedNotification = () => (
  <div className='flex justify-end'>
    <Toast>
      <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
        <HiCheck className="h-5 w-5" />
      </div>
      <div className="ml-3 text-sm font-normal">
        Paragraph Saved!
      </div>
      <Toast.Toggle />
    </Toast>
  </div>
);

export default function Dashboard() {
  const [userData, setUserData] = useState({} as Record);
  const [bio, setBio] = useState('');
  const [saved, setSaved] = useState(false);
  const [checklist, setCheckList] = useState({
    downloadExtension: false,
    addBio: false,
    sendFirstReel: false,
  });
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const settings = {
        downloadExtension: true,
        addBio: false,
        sendFirstReel: false,
      }
      const storageData = localStorage.getItem('pocketbase_auth');
      if (storageData !== null) {
        const userInfo = JSON.parse(storageData);
        if (Object.hasOwn(userInfo, 'model')) {
          setUserData(userInfo.model as Record);
          if (userInfo.model.bio !== undefined) {
            settings.addBio = true;
          }
        }
      }
      const sentFirstReel = localStorage.getItem('first_reel_sent');
      if (sentFirstReel !== null) {
        settings.sendFirstReel = true;
      }
      setCheckList({
        ...checklist,
        ...settings,
      });
    }
  }, []);

  const handleSave = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const pb = new PocketBase(process.env.NEXT_PUBLIC_API_URL);
    const data = {
      bio
    }
    // submit bio
    if (JSON.stringify(userData) !== '{}' && userData.hasOwnProperty('id')) {
      const recordId: string = userData['id'] as string;
      try {
        // Update record
        const record = await pb.collection('users').update(recordId, data);
        // Update local storage data
        const storageData = localStorage.getItem('pocketbase_auth');
        if (storageData !== null) {
          localStorage.setItem('pocketbase_auth', JSON.stringify({
            ...JSON.parse(storageData),
            model: record
          }));
        }
        // Update UI
        setBio('');
        setSaved(true);
        setCheckList({
          ...checklist,
          addBio: true,
        });
        setTimeout(() => {
          setSaved(false)
        }, 5000);
      } catch (err) {
        console.log(err);
        router.push('/auth');
      }
    } else {
      router.push('/auth');
    }
  }

  const sentFirstReel = () => {
    if (checklist.sendFirstReel) return;
    setCheckList({
      ...checklist,
      sendFirstReel: true,
    });
    localStorage.setItem('first_reel_sent', 'true');
  }

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
          {saved ? <SavedNotification /> : null}
          <div className="flex justify-center">
            <Card className="mt-4 mb-4 w-2/3">
              <h2 className="text-xl dark:text-gray-200">Dashboard</h2>
              <Accordion collapseAll alwaysOpen>
                <Accordion.Panel>
                  <Accordion.Title>
                    <div className='flex gap-px'>
                      {checklist.downloadExtension ? <CompleteCheckIcon /> : <IncompleteCheckIcon />}
                      <span className='mt-1'>Download our Chrome Extension</span>
                    </div>
                  </Accordion.Title>
                  <Accordion.Content>
                    <p className="mb-2 text-gray-700 dark:text-gray-400">
                      To use Reel.fyi, you&apos;ll need to install our Chrome Extension.
                    </p>
                    <a className="text-purple-600 hover:underline dark:text-purple-500" href="https://reel.fyi">
                      Download it from here!
                    </a>
                  </Accordion.Content>
                </Accordion.Panel>
                <Accordion.Panel>
                  <Accordion.Title>
                    <div className='flex gap-px'>
                      {checklist.addBio ? <CompleteCheckIcon /> : <IncompleteCheckIcon />}
                      <span className='mt-1'>Train your AI</span>
                    </div>
                  </Accordion.Title>
                  <Accordion.Content>
                    <div className='flex flex-col gap-3'>
                      <ul className="ml-4 mb-4 list-disc text-gray-700 dark:text-gray-400 font-light">
                        <li>
                          Get messgaes personalized to you as a job seeker
                        </li>
                        <li>
                          What&apos;s most relevant to you?
                        </li>
                        <li>
                          What&apos;s most relevant to your dream job or company?
                        </li>
                      </ul>
                      <div className='flex justify-between items-center'>
                        <p className="text-gray-700 dark:text-gray-400 font-medium">
                          Customize your outreach with a short paragraph
                        </p>
                        <p className='text-gray-600 dark:text-gray-500 font-light text-sm'>
                          {bio.length}/120
                        </p>
                      </div>
                      <Textarea
                        minLength={10}
                        maxLength={120}
                        rows={2}
                        className="mb-2"
                        placeholder="I&apos;m Dake, an incoming product manager intern at Microsoft and co-founder of Reel.fyi. I&apos;m also a junior at Indiana University and president of Product Management Club at IU."
                        onChange={(e) => setBio(e.target.value)}
                        value={bio}
                      />
                      <div className='flex gap-x-4'>
                        <Button type="submit"
                          className='w-20'
                          color="purple"
                          onClick={handleSave}>
                          Save
                        </Button>
                        <Button type="button"
                          className='w-20'
                          color="clear"
                          onClick={() => setBio('')}>
                          Clear
                        </Button>
                      </div>
                    </div>
                  </Accordion.Content>
                </Accordion.Panel>
                <Accordion.Panel>
                  <Accordion.Title>
                    <div className='flex gap-px'>
                      {checklist.sendFirstReel ? <CompleteCheckIcon /> : <IncompleteCheckIcon />}
                      <span className='mt-1'>Send your first Reel! 🥳</span>
                    </div>
                  </Accordion.Title>
                  <Accordion.Content>
                    <p className="mb-2 text-gray-700 dark:text-gray-400 font-medium">
                      Send your first Reel by connecting with the founders of Reel.fyi on LinkedIn!
                    </p>
                    <div className='flex gap-x-3'>
                      <a className="text-purple-600 hover:underline dark:text-purple-500" href="https://www.linkedin.com/in/dakezhang/" target="_blank" onClick={() => sentFirstReel()}>
                        Connect with Dake
                      </a>
                      <a className="text-purple-600 hover:underline dark:text-purple-500" href="https://www.linkedin.com/in/yesh-c/" target="_blank" onClick={() => sentFirstReel()}>
                        Connect with Yesh
                      </a>
                    </div>
                  </Accordion.Content>
                </Accordion.Panel>
              </Accordion>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}