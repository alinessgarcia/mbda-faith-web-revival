
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
    // SEO improvements
    document.title = "MBdA Reconciliação - Igreja Cristã | Ministério Bíblico da Reconciliação";
    
    // Meta description
    const metaDescription = document.querySelector('meta[name="description"]') || document.createElement('meta');
    metaDescription.setAttribute("name", "description");
    metaDescription.setAttribute("content", "Igreja cristã em Guarujá/SP dedicada ao ensino da Palavra de Deus, comunhão familiar e crescimento espiritual. Conheça o Ministério Bíblico da Reconciliação.");
    if (!document.querySelector('meta[name="description"]')) {
      document.head.appendChild(metaDescription);
    }
    
    // Meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]') || document.createElement('meta');
    metaKeywords.setAttribute("name", "keywords");
    metaKeywords.setAttribute("content", "igreja cristã, ministério bíblico, reconciliação, Guarujá, São Paulo, comunhão, família, palavra de Deus");
    if (!document.querySelector('meta[name="keywords"]')) {
      document.head.appendChild(metaKeywords);
    }

    // Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]') || document.createElement('meta');
    ogTitle.setAttribute("property", "og:title");
    ogTitle.setAttribute("content", "MBdA Reconciliação - Igreja Cristã");
    if (!document.querySelector('meta[property="og:title"]')) {
      document.head.appendChild(ogTitle);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]') || document.createElement('meta');
    ogDescription.setAttribute("property", "og:description");
    ogDescription.setAttribute("content", "Igreja cristã voltada ao ensino profundo da Palavra de Deus, comunhão familiar e edificação espiritual.");
    if (!document.querySelector('meta[property="og:description"]')) {
      document.head.appendChild(ogDescription);
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
