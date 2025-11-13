import { cookies } from 'next/headers';

type Theme = 'light' | 'dark';

const useServerDarkMode = (defaultTheme: Theme = 'dark'): Theme => {
  return (cookies().get('theme')?.value as Theme) ?? defaultTheme;
};

export default useServerDarkMode;