import React from 'react';
import { Hero } from '../components/Hero';
import { Features } from '../components/Features';
import { Contact } from '../components/Contact';

export function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Contact />
    </>
  );
}