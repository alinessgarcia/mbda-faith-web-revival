
import Navbar from "../components/Navbar";

import QuemSomos from "../components/QuemSomos";
import DeclaracaoDeFe from "../components/DeclaracaoDeFe";
import Devocional from "../components/Devocional";
import EstudosBiblicos from "../components/EstudosBiblicos";

import Agenda from "../components/Agenda";
import EspacoFamilia from "../components/EspacoFamilia";
import Midia from "../components/Midia";
import ContatoForm from "../components/ContatoForm";
import Footer from "../components/Footer";
import FloatingButtons from "../components/FloatingButtons";
import ChatBox from "../components/ChatBox";
import { useSEO } from "../hooks/useSEO";
import { SEO_CONFIG } from "../constants";
import ReconNewsFeed from "../components/ReconNewsFeed";

const Index = () => {
  // Configuração SEO centralizada
  useSEO(SEO_CONFIG);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <ReconNewsFeed />
        <QuemSomos />
        <DeclaracaoDeFe />
        <Devocional />
        <EstudosBiblicos />

        <Agenda />
        <EspacoFamilia />
        <Midia />
        <ContatoForm />
      </main>
      <Footer />
      <FloatingButtons />
      <ChatBox />
    </div>
  );
};

export default Index;
