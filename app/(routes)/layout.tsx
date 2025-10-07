import Header from '@/components/layout/Header';
import React from 'react';

export default function AppPagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <section className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </section>
    </>
  );
}