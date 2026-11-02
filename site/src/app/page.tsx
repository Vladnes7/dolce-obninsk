import { Catalog } from "@/components/Catalog";
import { ContactProvider } from "@/components/Contact";
import { Bento, CustomCake } from "@/components/CustomCake";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Journal } from "@/components/Journal";
import { FactsBand } from "@/components/Marquee";
import { OrderDrawer } from "@/components/order/OrderDrawer";
import { Partners } from "@/components/Partners";
import { Cafe, Delivery, Footer, Reviews, Shops } from "@/components/Sections";

export default function Home() {
  return (
    <ContactProvider>
      <Header />
      <main>
        <Hero />
        <FactsBand />
        <Catalog />
        <Bento />
        <CustomCake />
        <Reviews />
        <Cafe />
        <Journal />
        <Delivery />
        <Shops />
        <Partners />
      </main>
      <Footer />
      <OrderDrawer />
    </ContactProvider>
  );
}
