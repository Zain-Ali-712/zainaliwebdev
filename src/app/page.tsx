import { Hero } from "@/components/sections/Hero";
import { About, Statement } from "@/components/sections/About";
import { Works } from "@/components/sections/Works";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { Stack } from "@/components/sections/Stack";
import { Journey, Reels } from "@/components/sections/Journey";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <Statement />
      <About />
      <Works />
      <Services />
      <Process />
      <Stack />
      <Journey />
      <Reels />
      <Contact />
      <Footer />
    </>
  );
}
