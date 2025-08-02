
import { useState } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

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
      const response = await fetch("https://formspree.io/f/myzwanve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
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
    <section id="contato" className="section-padding bg-blue-50">
      <div className="container mx-auto">
        <h2 className="section-title">Contato</h2>
        <p className="text-gray-700 max-w-3xl mx-auto mb-8 text-center">
          Entre em contato conosco para mais informações ou para compartilhar
          sua mensagem. Estamos aqui para ajudar!
        </p>
        
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
                className="block text-gray-700 font-medium mb-2"
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
                className="block text-gray-700 font-medium mb-2"
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
                className="block text-gray-700 font-medium mb-2"
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
