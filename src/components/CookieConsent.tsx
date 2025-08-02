import React, { useState, useEffect } from "react";

const CookieConsent = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) setShow(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-lg p-6 z-50 max-w-xs w-full text-center border">
      <h3 className="font-bold text-green-900 mb-2">Consentimento de Privacidade</h3>
      <p className="text-gray-700 text-sm mb-4">
        Nosso site utiliza-se de cookies para personalizar anúncios, gerar dados estatísticos e garantir sua melhor experiência.
      </p>
      <button
        onClick={handleAccept}
        className="bg-green-900 text-white font-semibold px-6 py-2 rounded-full hover:bg-green-800 transition"
      >
        Entendi
      </button>
    </div>
  );
};

export default CookieConsent;