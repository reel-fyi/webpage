import { Accordion, Alert, Button, Card, Textarea, Modal } from 'flowbite-react';
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AiFillCheckCircle, AiOutlineCheckCircle } from 'react-icons/ai';
import { HiCheck } from 'react-icons/hi'
import PocketBase, { type Record } from 'pocketbase';

import Header from "../components/Header";
import welcomeImage from "../public/welcome.svg"

const CompleteCheckIcon = () => (
  <AiFillCheckCircle className='mr-2 text-purple-700' size={32} />
);

const IncompleteCheckIcon = () => (
  <AiOutlineCheckCircle className='mr-2 text-purple-700' size={32} />
);

const SavedNotification = () => (
  <Alert
    color="success"
    icon={HiCheck}
  >
    <span>
      <span className="font-medium text-md">
        Paragraph Saved!
      </span>
    </span>
  </Alert>
);

export default function Dashboard() {
  const [userData, setUserData] = useState({} as Record);
  const [firstName, setFirstName] = useState('');
  const [bio, setBio] = useState('');
  const [saved, setSaved] = useState(false);
  const [checklist, setCheckList] = useState({
    downloadExtension: false,
    addBio: false,
    sentFirstReel: false,
  });
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const settings = {
        downloadExtension: true,
        addBio: false,
        sentFirstReel: false,
      }
      const storageData = localStorage.getItem('pocketbase_auth');
      if (storageData !== null) {
        const userInfo = JSON.parse(storageData);
        if (Object.hasOwn(userInfo, 'model')) {
          setUserData(userInfo.model as Record);
          if (userInfo.model.bio !== undefined && userInfo.model.bio !== '') {
            setBio(userInfo.model.bio as string);
            settings.addBio = true;
            const sentFirstReel = localStorage.getItem('first_reel_sent');
            if (sentFirstReel !== null) {
              settings.sentFirstReel = true;
            }
          }
          const fname = (userInfo.model['name'] as string).split(' ')[0];
          setFirstName(fname[0].toUpperCase() + fname.slice(1));
        }
      }
      setCheckList({
        ...checklist,
        ...settings,
      });

      if (router.asPath === '/dashboard?ref=signup') {
        if (storageData !== null) {
          setShowWelcomeModal(true);
          console.log(userData);
        } else {
          router.push('/auth?ref=dashboard');
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        // Update extension
        chrome.runtime.sendMessage(process.env.NEXT_PUBLIC_EXTENSION_ID, {profileUpdated: true}, (response) => {
          if (!response) {
            console.error('No response from extension');
          } else if (response.success) {
            console.log('Extension updated');
          } else if (!response.success) {
            console.error('Extension update failed');
          } else {
            console.error(response);
          }
        });
        // Update UI
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
        router.push('/auth?ref=dashboard');
      }
    } else {
      router.push('/auth?ref=dashboard');
    }
  }

  const sentFirstReel = () => {
    if (checklist.sentFirstReel) return;
    setCheckList({
      ...checklist,
      sentFirstReel: true,
    });
    localStorage.setItem('first_reel_sent', 'true');
  }

  const bioMaxLen = 300;

  const welcomeModalComponent = (
    <Modal
      show={showWelcomeModal}
      size="4xl"
      position="center"
      popup={true}
      onClose={() => setShowWelcomeModal(false)}
    >
      <Modal.Header />
      <Modal.Body>
        <div className="flex flex-col justify-center items-center gap-4">
          <h2 className="dark:text-gray-200 text-3xl font-medium mb-4">Welcome to Reel.fyi!</h2>
          <Image
            src={welcomeImage}
            alt="welcome image"
            className='mb-4'
          />
          <p className='text-gray-700 dark:text-gray-300'>
            Hi&nbsp;
            <span className='text-purple-700'>{firstName}</span>,
            we&apos;re excited to help you simplify online networking & get more job responses.
            First, we&apos;ll guide you through setting up your account. Don&apos;t hesitate to reach out if you have any questions or need further assistance. Happy networking!
          </p>
          <Button onClick={() => setShowWelcomeModal(false)} color="purple" className="self-end">
            Let&apos;s get started
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );

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
          {showWelcomeModal ? welcomeModalComponent : null}
          <div className="flex justify-center">
            <Card className="mt-4 mb-4 w-2/3">
              <h2 className="text-xl dark:text-gray-200">Dashboard</h2>
              <Accordion collapseAll alwaysOpen>
                <Accordion.Panel>
                  <Accordion.Title className='focus:ring-transparent'>
                    <div className='flex gap-px'>
                      {checklist.downloadExtension ? <CompleteCheckIcon /> : <IncompleteCheckIcon />}
                      <span className='mt-1'>Download our Chrome Extension</span>
                    </div>
                  </Accordion.Title>
                  <Accordion.Content>
                    <p className="mb-2 text-gray-700 dark:text-gray-400 font-light">
                      To use Reel.fyi, you&apos;ll need to install our Chrome Extension.
                    </p>
                    <a className="text-purple-600 hover:underline dark:text-purple-500" href="https://chrome.google.com/webstore/detail/reelfyi-chrome-extension/fhofneeegphbcpfdepceejjekejkhlki">
                      Download it from here!
                    </a>
                  </Accordion.Content>
                </Accordion.Panel>
                <Accordion.Panel>
                  <Accordion.Title className='focus:ring-transparent'>
                    <div className='flex gap-px'>
                      {checklist.addBio ? <CompleteCheckIcon /> : <IncompleteCheckIcon />}
                      <span className='mt-1'>Personalize your outreach messages</span>
                    </div>
                  </Accordion.Title>
                  <Accordion.Content>
                    <div className='flex flex-col gap-3'>
                      {saved ? <SavedNotification /> : null}
                      <p className="mb-2 text-gray-700 dark:text-gray-400 font-light">
                        Stand out on LinkedIn with personalized messaging.
                        Tell us about your career and professional journey in just a few sentences.
                        We&apos;ll use this info to craft tailored outreach messages that increase your chances of success.
                        Happy networking!
                      </p>
                      <div className='flex justify-between items-center'>
                        <p className="text-gray-700 dark:text-gray-400 font-medium">
                          Customize your outreach with a short paragraph
                        </p>
                        <p className='text-gray-600 dark:text-gray-500 font-light text-sm'>
                          {bio.length}/{bioMaxLen}
                        </p>
                      </div>
                      <Textarea
                        minLength={10}
                        maxLength={bioMaxLen}
                        rows={3}
                        className="mb-2 placeholder:text-gray-400"
                        placeholder="I&apos;m Richard, founder and CEO of Piped Piper, a compression company. Prior to this I worked at Hooli, a tech giant, as a software engineer. I also developed a music app on the side, where I stumbled upon the compression algorithm that would eventually become the foundation of Pied Piper."
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
                  <Accordion.Title className='focus:ring-transparent'>
                    <div className='flex gap-px'>
                      {checklist.sentFirstReel ? <CompleteCheckIcon /> : <IncompleteCheckIcon />}
                      <span className='mt-1'>Send your first Reel! 🥳</span>
                    </div>
                  </Accordion.Title>
                  <Accordion.Content onClick={sentFirstReel}>
                    <div className='flex flex-col gap-3'>
                      <p className="mb-2 text-gray-700 dark:text-gray-400 font-light">
                        Start networking with one-click outreach - now that you&apos;re all set up, it&apos;s time to start reaching out to potential connections with just one click! We&apos;ll walk you through with a demo first.
                      </p>
                      <span className='text-gray-700 dark:text-gray-300 font-semibold'>
                        Click below to learn how to send your first Reel!
                      </span>
                      <div className='flex h-[36rem]'>
                        <iframe
                          src="https://demo.arcade.software/2gCk5eGLEp6wdYHk9aB6?embed"
                          loading="lazy"
                          allowFullScreen
                          className='w-full'
                          title="Reel.fyi demo" />
                      </div>
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