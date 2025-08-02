
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import QuemSomos from "../components/QuemSomos";
import DeclaracaoDeFe from "../components/DeclaracaoDeFe";
import Devocional from "../components/Devocional";
import EstudosBiblicos from "../components/EstudosBiblicos";
import Seterec from "../components/Seterec";
import Agenda from "../components/Agenda";
import EspacoFamilia from "../components/EspacoFamilia";
import Midia from "../components/Midia";
import SitesSugestivos from "../components/SitesSugestivos";
import ContatoForm from "../components/ContatoForm";
import Footer from "../components/Footer";
import FloatingButtons from "../components/FloatingButtons";
import ChatBox from "../components/ChatBox";
import { useSEO } from "../hooks/useSEO";
import { SEO_CONFIG } from "../constants";

const Index = () => {
  // Configuração SEO centralizada
  useSEO(SEO_CONFIG);

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <main>
        <QuemSomos />
        <DeclaracaoDeFe />
        <Devocional />
        <EstudosBiblicos />
        <Seterec />
        <Agenda />
        <EspacoFamilia />
        <Midia />
        <SitesSugestivos />
        <ContatoForm />
      </main>
      <Footer />
      <FloatingButtons />
      <ChatBox />
    </div>
  );
};

export default Index;
