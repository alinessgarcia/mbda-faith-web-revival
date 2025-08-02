// Utilitários de validação
export const validators = {
  required: (value: string, fieldName: string) => 
    !value.trim() ? `${fieldName} é obrigatório` : '',

  email: (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !emailRegex.test(value) ? 'Email inválido' : '';
  },

  minLength: (value: string, min: number, fieldName: string) =>
    value.length < min ? `${fieldName} deve ter pelo menos ${min} caracteres` : '',

  maxLength: (value: string, max: number, fieldName: string) =>
    value.length > max ? `${fieldName} deve ter no máximo ${max} caracteres` : ''
};

// Validação para formulário de contato
export const validateContactForm = (values: { nome: string; email: string; mensagem: string }) => {
  const errors: Record<string, string> = {};

  // Nome
  const nomeError = validators.required(values.nome, 'Nome') || 
                   validators.minLength(values.nome, 2, 'Nome');
  if (nomeError) errors.nome = nomeError;

  // Email
  const emailError = validators.required(values.email, 'Email') || 
                    validators.email(values.email);
  if (emailError) errors.email = emailError;

  // Mensagem
  const mensagemError = validators.required(values.mensagem, 'Mensagem') || 
                       validators.minLength(values.mensagem, 10, 'Mensagem');
  if (mensagemError) errors.mensagem = mensagemError;

  return errors;
};