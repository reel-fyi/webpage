import { Accordion, Alert, Button, Card, Textarea, Modal } from 'flowbite-react';
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AiFillCheckCircle, AiOutlineCheckCircle } from 'react-icons/ai';
import { HiCheck, HiInformationCircle } from 'react-icons/hi'
import PocketBase, { type Record } from 'pocketbase';
import mixpanel from 'mixpanel-browser';
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
  const [isAnalyticsEnabled, setIsAnalyticsEnabled] = useState(false);
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
      } else if (router.asPath === '/dashboard?ref=bio_saved') {
        setSaved(true);
      }

      const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
      if (token) {
        mixpanel.init(token, {
          loaded: () => {
            if (mixpanel.get_distinct_id() !== userData.id) {
              mixpanel.identify(userData.id);
            }
          }
        });
        if (process.env.NODE_ENV === 'production') {
          setIsAnalyticsEnabled(true);
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
        // Update analytics
        if (isAnalyticsEnabled) {
          mixpanel.track('dashboard_personalize_save');
        }
        // Update extension
        if (typeof window !== 'undefined') {
          window.postMessage({ type: 'UPDATE_PROFILE' }, '*');
        } else {
          console.error('Update extension: window object not found');
        }
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

  const handleClear = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setBio('');
    // Update analytics
    if (isAnalyticsEnabled) {
      mixpanel.track('dashboard_personalize_clear');
    }
  }

  const handleOnTextAreaFocus = (e: React.SyntheticEvent) => {
    e.preventDefault();
    // Update analytics
    if (isAnalyticsEnabled) {
      mixpanel.track('dashboard_text_input_focused');
    }
  }

  const handleOnDemoClick = (e: React.SyntheticEvent) => {
    // Update analytics
    if (isAnalyticsEnabled) {
      mixpanel.track('dashboard_demo_click');
    }
    if (!checklist.sentFirstReel) {
      setCheckList({
        ...checklist,
        sentFirstReel: true,
      });
      localStorage.setItem('first_reel_sent', 'true');
    }
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

  const isDown = true;
  const isDownAlertComponent = (
    <Alert
    color="failure"
    icon={HiInformationCircle}
  >
    <span>
      <span className="font-semibold text-md">
        Reel.fyi is currently down, please check back later or contact us at&nbsp;<a href="mailto:support@reel.fyi" className='hover:text-red-500'>support@reel.fyi</a>
      </span>
    </span>
  </Alert>
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
          {isDown ? isDownAlertComponent : null}
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
                    <a
                      className="text-purple-600 hover:underline dark:text-purple-500"
                      href="https://chrome.google.com/webstore/detail/reelfyi-chrome-extension/fhofneeegphbcpfdepceejjekejkhlki"
                      target='_blank'>
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
                        To get started, provide a short summary of your career
                        and professional journey. Consider this as your elevator
                        pitch - only the most relevant highlights need to be included.
                        And don&apos;t worry about crafting the perfect intent -
                        our AI-generated messages are already optimized to facilitate
                        calls with your prospective connections.
                      </p>
                      <div className='flex justify-between items-center'>
                        <p className="text-gray-700 dark:text-gray-400 font-medium">
                          Career Summary
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
                        onFocus={handleOnTextAreaFocus}
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
                          onClick={handleClear}>
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
                  <Accordion.Content onClick={handleOnDemoClick}>
                    <div className='flex flex-col gap-3'>
                      <p className="mb-2 text-gray-700 dark:text-gray-400 font-light">
                        Start networking with one-click outreach - now that you&apos;re all set up, it&apos;s time to start reaching out to potential connections with just one click! We&apos;ll walk you through with a demo first.
                      </p>
                      <span className='text-gray-700 dark:text-gray-300 font-semibold'>
                        Click below to learn how to send your first Reel!
                      </span>
                      <div className='flex h-[36rem]'>
                        <iframe
                          src="https://demo.arcade.software/TI0BXfE1KIH1G58a2J44?embed"
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