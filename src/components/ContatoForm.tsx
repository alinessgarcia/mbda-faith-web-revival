
import { useState, useEffect } from "react";
import { Send, CheckCircle, AlertCircle, Shield, Clock } from "lucide-react";
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '../config/emailjs';
import { contactFormLimiter } from '../utils/rateLimiter';
import { validateEmail, sanitizeInput, isBot } from '../utils/emailValidator';

interface FormData {
  nome: string;
  email: string;
  mensagem: string;
  honeypot: string; // Campo invisível para detectar bots
}

const ContatoForm = () => {
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    email: "",
    mensagem: "",
    honeypot: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [rateLimitError, setRateLimitError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [userIdentifier] = useState(() => 
    // Criar identificador único baseado em fingerprint simples
    `${navigator.userAgent.slice(0, 50)}_${Date.now()}_${Math.random()}`
  );

  // Inicializar EmailJS
  useEffect(() => {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // Sanitizar input
    const sanitizedValue = sanitizeInput(value);
    
    setFormData((prev) => ({
      ...prev,
      [name]: sanitizedValue
    }));

    // Validar email em tempo real
    if (name === 'email' && value.length > 0) {
      const emailValidation = validateEmail(value);
      if (!emailValidation.isValid) {
        setEmailError('Formato de email inválido');
      } else if (emailValidation.isSuspicious || emailValidation.isTemporary) {
        setEmailError('Por favor, use um email válido e permanente');
      } else {
        setEmailError('');
      }
    }

    // Limpar erros quando usuário digita
    if (rateLimitError) setRateLimitError('');
    if (submitError) setSubmitError(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(false);
    setRateLimitError('');

    try {
      // 🛡️ VERIFICAÇÃO 1: Honeypot (detectar bots)
      if (isBot(formData.honeypot)) {
        console.log('Bot detectado via honeypot');
        contactFormLimiter.recordAttempt(userIdentifier, false);
        setSubmitError(true);
        return;
      }

      // 🛡️ VERIFICAÇÃO 2: Rate Limiting
      if (!contactFormLimiter.canAttempt(userIdentifier)) {
        const timeRemaining = contactFormLimiter.getTimeRemaining(userIdentifier);
        setRateLimitError(
          `Muitas tentativas. Tente novamente em ${Math.ceil(timeRemaining / 60)} minutos.`
        );
        return;
      }

      // 🛡️ VERIFICAÇÃO 3: Validação avançada de email
      const emailValidation = validateEmail(formData.email);
      if (!emailValidation.isValid || emailValidation.isSuspicious || emailValidation.isTemporary) {
        setEmailError('Por favor, use um email válido e permanente');
        contactFormLimiter.recordAttempt(userIdentifier, false);
        return;
      }

      // 🛡️ VERIFICAÇÃO 4: Validação de conteúdo
      if (formData.nome.length < 2 || formData.mensagem.length < 10) {
        setSubmitError(true);
        contactFormLimiter.recordAttempt(userIdentifier, false);
        return;
      }

      // ✅ ENVIO DO EMAIL
      const templateParams = {
        name: sanitizeInput(formData.nome),
        email: formData.email.toLowerCase().trim(),
        message: sanitizeInput(formData.mensagem),
        timestamp: new Date().toLocaleString('pt-BR'),
        userAgent: navigator.userAgent.slice(0, 100)
      };
      
      const result = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams,
        EMAILJS_CONFIG.PUBLIC_KEY
      );

      if (result.status === 200) {
        // ✅ Sucesso - registrar tentativa bem-sucedida
        contactFormLimiter.recordAttempt(userIdentifier, true);
        setSubmitSuccess(true);
        setFormData({ nome: "", email: "", mensagem: "", honeypot: "" });
        setEmailError('');
        
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
      } else {
        throw new Error('EmailJS returned non-200 status');
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
    <section id="contato" className="section-padding" style={{ backgroundColor: 'rgba(0, 140, 227, 0.7)' }}>
      <div className="container mx-auto">
        {/* Título com glassmorphism */}
        <div className="text-center mb-16">

          <h2 className="text-2xl md:text-3xl lg:text-3xl font-bold text-yellow-title drop-shadow-lg">
            📞 Contato
          </h2>
        </div>

        <div className="max-w-2xl mx-auto bg-gray-50 p-6 md:p-8 rounded-lg shadow-sm">
          {submitSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">
              <span className="block sm:inline">
                Mensagem enviada com sucesso! Entraremos em contato em breve.
              </span>
            </div>
          )}

          {submitError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span className="block sm:inline">
                Ocorreu um erro ao enviar sua mensagem. Por favor, verifique os dados e tente novamente.
              </span>
            </div>
          )}

          {rateLimitError && (
            <div className="bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded relative mb-6 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              <span className="block sm:inline">
                {rateLimitError}
              </span>
            </div>
          )}

          {emailError && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-6 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              <span className="block sm:inline">
                {emailError}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* 🍯 Honeypot - Campo invisível para detectar bots */}
            <input
              type="text"
              name="honeypot"
              value={formData.honeypot}
              onChange={handleChange}
              style={{ display: 'none' }}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />
            
            <div className="mb-4">
              <label
                htmlFor="nome"
                className="block text-black-custom font-medium mb-2"
              >
                Nome:
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-black-custom font-medium mb-2"
              >
                E-mail:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent ${
                  emailError ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              />
              {emailError && (
                <p className="text-red-600 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {emailError}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label
                htmlFor="mensagem"
                className="block text-black-custom font-medium mb-2"
              >
                Mensagem:
              </label>
              <textarea
                id="mensagem"
                name="mensagem"
                value={formData.mensagem}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
              ></textarea>
            </div>

            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting || !!rateLimitError || !!emailError}
                className="bg-secondary text-white font-medium py-3 px-6 rounded-md hover:bg-secondary/90 transition-colors disabled:opacity-70 w-full md:w-auto flex items-center justify-center mx-auto"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Mensagem
                  </>
                )}
              </button>
              
              <p className="text-sm text-gray-600 mt-3 flex items-center justify-center">
                <Shield className="w-4 h-4 mr-1" />
                Protegido contra spam e bots
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContatoForm;
