import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { CustomFlowbiteTheme, Flowbite, useTheme } from 'flowbite-react';

function MyApp({ Component, pageProps }: AppProps) {
  const theme: CustomFlowbiteTheme = {
    button: {
      color: {
        'clear': 'text-purple-700 dark:text-purple-500 hover:text-white dark:hover:text-white bg-transparent border border-purple-700 hover:bg-purple-600 focus:ring-4 focus:ring-purple-300 disabled:hover:bg-purple-700 dark:hover:bg-purple-700 dark:focus:ring-purple-800 dark:disabled:hover:bg-purple-600 focus:!ring-2 group flex h-min items-center justify-center p-0.5 text-center font-medium focus:z-10 rounded-lg',
      }
    },
    textInput: {
      field: {
        input: {
          base: 'block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-purple-500 dark:focus:ring-purple-500 rounded-lg p-2.5 text-sm'
        }
      }
    },
    textarea: {
      base: 'block w-full rounded-lg border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-purple-500 dark:focus:ring-purple-500'
    },
    tab: {
      tablist: {
        tabitem: {
          styles: {
            underline: {
              base: 'flex items-center justify-center p-4 text-sm font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500',
              active: {
                on: 'text-purple-600 rounded-t-lg border-b-2 border-purple-600 active dark:text-purple-500 dark:border-purple-500 focus-visible:outline-none',
                off: 'border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300'
              }
            }
          }
        }
      }
    }
  };

  return (
    <Flowbite theme={{ theme }}>
      <Component {...pageProps} />
    </Flowbite>
  );
}
export default MyApp
