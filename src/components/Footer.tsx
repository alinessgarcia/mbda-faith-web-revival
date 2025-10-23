
import { Link } from "react-router-dom";
import { useScrollTo } from "../hooks/useScrollTo";
import { SOCIAL_LINKS } from "../constants";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { scrollToTop } = useScrollTo();

  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto py-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">MBdaReconciliação</h3>
            <p className="mb-2">
              Igreja cristã voltada ao ensino profundo da Palavra de Deus,<br />
              comunhão familiar e edificação espiritual.
            </p>
            <p className="text-white/80">
              Av. Osvaldo Aranha, nº790<br />
              Jardim Maravilha (Vicente de Carvalho)<br />
              Guarujá/SP<br />
              CEP: 11470-100
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <button onClick={scrollToTop} className="hover:text-secondary transition-colors">
                  Voltar ao Início
                </button>
              </li>
              <li>
                <a 
                  href="https://maps.app.goo.gl/zbXh9cc38umsD9bU7" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-secondary transition-colors"
                >
                  Endereço
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Horários</h3>
            <ul className="space-y-2">
              <li>Domingo: 08:00hrs / 09:00hrs / 11:00hrs</li>

              <li>Quarta-feira: 20:00hrs Oração e Palavra</li>

              <li>Sexta-feira: 20:00hrs Oração e Palavra (Online)</li>
            </ul>
            <div className="mt-4">
              <a
                href="https://wa.me/+5513981517913"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-white hover:text-secondary transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="mr-2"
                >
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                +55 (13) 98151-7913
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t border-white/20 text-center text-white/70">
          <p>
            &copy; {currentYear} MBdaReconciliação - Todos os direitos reservados
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
