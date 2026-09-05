import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dead Women Society',
  description: 'An independent feminist archive of women who refused the terms they were handed.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
