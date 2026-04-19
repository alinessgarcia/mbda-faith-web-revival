import { useState, useEffect } from "react";
import { Send, CheckCircle, AlertCircle, Shield, Clock } from "lucide-react";
import emailjs from "@emailjs/browser";
import { EMAILJS_CONFIG } from "../config/emailjs";
import { contactFormLimiter } from "../utils/rateLimiter";
import { validateEmail, sanitizeInput, isBot } from "../utils/emailValidator";

interface FormData {
  nome: string;
  email: string;
  mensagem: string;
  honeypot: string;
}

const ContatoForm = () => {
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    email: "",
    mensagem: "",
    honeypot: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [rateLimitError, setRateLimitError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [userIdentifier] = useState(
    () => `${navigator.userAgent.slice(0, 50)}_${Date.now()}_${Math.random()}`
  );

  useEffect(() => {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);

    setFormData((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }));

    if (name === "email" && value.length > 0) {
      const emailValidation = validateEmail(value);
      if (!emailValidation.isValid) {
        setEmailError("Formato de e-mail inválido");
      } else if (emailValidation.isSuspicious || emailValidation.isTemporary) {
        setEmailError("Use um e-mail válido e permanente");
      } else {
        setEmailError("");
      }
    }

    if (rateLimitError) setRateLimitError("");
    if (submitError) setSubmitError(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(false);
    setRateLimitError("");

    try {
      if (isBot(formData.honeypot)) {
        contactFormLimiter.recordAttempt(userIdentifier, false);
        setSubmitError(true);
        return;
      }

      if (!contactFormLimiter.canAttempt(userIdentifier)) {
        const timeRemaining = contactFormLimiter.getTimeRemaining(userIdentifier);
        setRateLimitError(`Muitas tentativas. Tente novamente em ${Math.ceil(timeRemaining / 60)} minutos.`);
        return;
      }

      const emailValidation = validateEmail(formData.email);
      if (!emailValidation.isValid || emailValidation.isSuspicious || emailValidation.isTemporary) {
        setEmailError("Use um e-mail válido e permanente");
        contactFormLimiter.recordAttempt(userIdentifier, false);
        return;
      }

      if (formData.nome.length < 2 || formData.mensagem.length < 10) {
        setSubmitError(true);
        contactFormLimiter.recordAttempt(userIdentifier, false);
        return;
      }

      const templateParams = {
        name: sanitizeInput(formData.nome),
        email: formData.email.toLowerCase().trim(),
        message: sanitizeInput(formData.mensagem),
        timestamp: new Date().toLocaleString("pt-BR"),
        userAgent: navigator.userAgent.slice(0, 100),
      };

      const result = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams,
        EMAILJS_CONFIG.PUBLIC_KEY
      );

      if (result.status === 200) {
        contactFormLimiter.recordAttempt(userIdentifier, true);
        setSubmitSuccess(true);
        setFormData({ nome: "", email: "", mensagem: "", honeypot: "" });
        setEmailError("");
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
      } else {
        throw new Error("EmailJS returned non-200 status");
      }
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      contactFormLimiter.recordAttempt(userIdentifier, false);
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contato" className="section-padding relative overflow-hidden bg-[#0a3572]/95">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-[#0f4ea8]/25 via-transparent to-[#072a59]/60" />

      <div className="container mx-auto relative z-10">
        <div className="mb-10 md:mb-12">
          <p className="inline-flex rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-white/90">
            Fale Conosco
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-white">Contato</h2>
          <p className="mt-2 text-white/75 max-w-2xl">
            Envie sua mensagem para nossa equipe pastoral. Respondemos o mais breve possível.
          </p>
        </div>

        <div className="max-w-3xl mx-auto rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-[0_14px_30px_rgba(2,22,64,0.32)] p-6 md:p-8">
          {submitSuccess && (
            <div className="mb-5 flex items-start gap-2 rounded-lg border border-emerald-300/40 bg-emerald-500/15 px-4 py-3 text-emerald-50">
              <CheckCircle className="h-5 w-5 mt-0.5 shrink-0" />
              <span>Mensagem enviada com sucesso. Entraremos em contato em breve.</span>
            </div>
          )}

          {submitError && (
            <div className="mb-5 flex items-start gap-2 rounded-lg border border-red-300/40 bg-red-500/15 px-4 py-3 text-red-50">
              <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
              <span>Ocorreu um erro ao enviar sua mensagem. Verifique os dados e tente novamente.</span>
            </div>
          )}

          {rateLimitError && (
            <div className="mb-5 flex items-start gap-2 rounded-lg border border-orange-300/40 bg-orange-500/15 px-4 py-3 text-orange-50">
              <Clock className="h-5 w-5 mt-0.5 shrink-0" />
              <span>{rateLimitError}</span>
            </div>
          )}

          {emailError && (
            <div className="mb-5 flex items-start gap-2 rounded-lg border border-yellow-300/40 bg-yellow-500/15 px-4 py-3 text-yellow-50">
              <Shield className="h-5 w-5 mt-0.5 shrink-0" />
              <span>{emailError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="honeypot"
              value={formData.honeypot}
              onChange={handleChange}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nome" className="block text-white font-medium mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-white/25 bg-white/10 px-4 py-2.5 text-white placeholder:text-white/55 focus:outline-none focus:ring-2 focus:ring-[#59a4ff]"
                  placeholder="Seu nome completo"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-white font-medium mb-2">
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`w-full rounded-lg px-4 py-2.5 text-white placeholder:text-white/55 focus:outline-none focus:ring-2 focus:ring-[#59a4ff] ${
                    emailError
                      ? "border border-red-300/60 bg-red-500/15"
                      : "border border-white/25 bg-white/10"
                  }`}
                  placeholder="voce@email.com"
                />
                {emailError && (
                  <p className="text-red-100 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {emailError}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="mensagem" className="block text-white font-medium mb-2">
                Mensagem
              </label>
              <textarea
                id="mensagem"
                name="mensagem"
                value={formData.mensagem}
                onChange={handleChange}
                required
                rows={6}
                className="w-full rounded-lg border border-white/25 bg-white/10 px-4 py-3 text-white placeholder:text-white/55 focus:outline-none focus:ring-2 focus:ring-[#59a4ff]"
                placeholder="Escreva sua mensagem..."
              />
            </div>

            <div className="mt-6 flex flex-col items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting || !!rateLimitError || !!emailError}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1d64d8] px-6 py-3 text-white font-semibold hover:bg-[#1958bf] transition-colors disabled:opacity-60 disabled:cursor-not-allowed w-full md:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 rounded-full border-2 border-white/70 border-b-transparent animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Enviar mensagem
                  </>
                )}
              </button>

              <p className="text-sm text-white/70 flex items-center gap-1">
                <Shield className="w-4 h-4" />
                Formulário protegido contra spam e bots.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContatoForm;
