
import React, { useEffect } from "react";
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

const Index = () => {
  useEffect(() => {
    document.title = "MBdA Reconciliação - Igreja Cristã";
    
    // Meta tags - Usando meta elements apenas como exemplo, já que React não pode modificar <head> diretamente sem helmet
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Comunidade cristã transformando vidas");
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
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
