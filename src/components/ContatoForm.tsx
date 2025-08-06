
import { useState, useEffect } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '../config/emailjs';

interface FormData {
  nome: string;
  email: string;
  mensagem: string;
}

const ContatoForm = () => {
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    email: "",
    mensagem: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  // Inicializar EmailJS
  useEffect(() => {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(false);

    try {
      // Debug: vamos ver se as configurações estão corretas
      console.log('EmailJS Config:', EMAILJS_CONFIG);
      console.log('Form Data:', formData);
      
      // Usando EmailJS - formato mais simples
      const templateParams = {
        name: formData.nome,
        email: formData.email,
        message: formData.mensagem
      };
      
      const result = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams,
        EMAILJS_CONFIG.PUBLIC_KEY
      );
      
      console.log('EmailJS Result:', result);

      if (result.status === 200) {
        setSubmitSuccess(true);
        setFormData({ nome: "", email: "", mensagem: "" });
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
      } else {
        setSubmitError(true);
      }
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
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
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
              <span className="block sm:inline">
                Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente.
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
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
                disabled={isSubmitting}
                className="bg-secondary text-white font-medium py-3 px-6 rounded-md hover:bg-secondary/90 transition-colors disabled:opacity-70 w-full md:w-auto"
              >
                {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContatoForm;
