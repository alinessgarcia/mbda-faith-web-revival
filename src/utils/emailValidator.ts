/**
 * Validador de email avançado com proteção anti-spam
 * Detecta emails temporários, domínios suspeitos e padrões de bot
 */

// Lista de domínios de email temporário conhecidos
const TEMPORARY_EMAIL_DOMAINS = [
  // Serviços populares de email temporário
  'tempmail.org', '10minutemail.com', 'guerrillamail.com',
  'mailinator.com', 'throwaway.email', 'temp-mail.org',
  'yopmail.com', 'maildrop.cc', 'sharklasers.com',
  'grr.la', 'guerrillamailblock.com', 'pokemail.net',
  'spam4.me', 'bccto.me', 'chacuo.net', 'dispostable.com',
  'emailondeck.com', 'fakeinbox.com', 'hide.biz.st',
  'mytrashmail.com', 'nobulk.com', 'sogetthis.com',
  'spamherelots.com', 'superrito.com', 'zoemail.org',
  
  // Domínios suspeitos adicionais
  'example.com', 'test.com', 'localhost', '127.0.0.1',
  'invalid.invalid', 'domain.com', 'email.com'
];

// Padrões suspeitos em emails
const SUSPICIOUS_PATTERNS = [
  /^test\d*@/i,           // test@, test1@, test123@
  /^admin\d*@/i,          // admin@, admin1@
  /^user\d*@/i,           // user@, user123@
  /^fake\d*@/i,           // fake@, fake123@
  /^spam\d*@/i,           // spam@, spam123@
  /^noreply\d*@/i,        // noreply@, noreply123@
  /^no-reply\d*@/i,       // no-reply@
  /^\d+@/,                // 123@domain.com
  /^[a-z]{1,2}@/i,        // a@, ab@domain.com
  /^.{1,2}@/,             // Emails muito curtos
  /(.)\1{4,}/,            // Caracteres repetidos (aaaaa)
  /@.{1,3}\./,            // Domínios muito curtos
];

interface EmailValidationResult {
  isValid: boolean;
  isSuspicious: boolean;
  isTemporary: boolean;
  reason?: string;
  score: number; // 0-100, quanto maior mais confiável
}

/**
 * Valida email com verificações avançadas
 * @param email - Email para validar
 * @returns EmailValidationResult - Resultado detalhado da validação
 */
export function validateEmail(email: string): EmailValidationResult {
  const result: EmailValidationResult = {
    isValid: false,
    isSuspicious: false,
    isTemporary: false,
    score: 0
  };

  // Validação básica de formato
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    result.reason = 'Formato de email inválido';
    return result;
  }

  // Verificações de tamanho
  if (email.length < 5) {
    result.reason = 'Email muito curto';
    return result;
  }

  if (email.length > 254) {
    result.reason = 'Email muito longo';
    return result;
  }

  const [localPart, domain] = email.toLowerCase().split('@');

  // Verificar domínio temporário
  if (TEMPORARY_EMAIL_DOMAINS.includes(domain)) {
    result.isTemporary = true;
    result.isSuspicious = true;
    result.reason = 'Email temporário detectado';
    result.score = 10;
    return result;
  }

  // Verificar padrões suspeitos
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(email)) {
      result.isSuspicious = true;
      result.reason = 'Padrão suspeito detectado';
      result.score = 20;
      break;
    }
  }

  // Verificações adicionais de qualidade
  let qualityScore = 50; // Score base

  // Bonus por domínios conhecidos e confiáveis
  const trustedDomains = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
    'live.com', 'msn.com', 'icloud.com', 'me.com',
    'aol.com', 'protonmail.com', 'tutanota.com'
  ];

  if (trustedDomains.includes(domain)) {
    qualityScore += 30;
  }

  // Bonus por parte local bem formada
  if (localPart.length >= 3 && localPart.length <= 20) {
    qualityScore += 10;
  }

  // Bonus por domínio bem formado
  if (domain.includes('.') && domain.length >= 4) {
    qualityScore += 10;
  }

  // Penalidade por caracteres especiais excessivos
  const specialChars = (localPart.match(/[^a-zA-Z0-9._-]/g) || []).length;
  if (specialChars > 2) {
    qualityScore -= 20;
  }

  // Penalidade por números excessivos
  const numbers = (localPart.match(/\d/g) || []).length;
  if (numbers > localPart.length * 0.7) {
    qualityScore -= 15;
  }

  result.isValid = true;
  result.score = Math.max(0, Math.min(100, qualityScore));

  // Marcar como suspeito se score muito baixo
  if (result.score < 30) {
    result.isSuspicious = true;
    result.reason = result.reason || 'Score de qualidade baixo';
  }

  return result;
}

/**
 * Validação simples para uso em formulários
 * @param email - Email para validar
 * @returns boolean - true se válido e não suspeito
 */
export function isValidEmail(email: string): boolean {
  const result = validateEmail(email);
  return result.isValid && !result.isSuspicious && !result.isTemporary;
}

/**
 * Honeypot - campo invisível para detectar bots
 * @param honeypotValue - Valor do campo honeypot
 * @returns boolean - true se é bot (honeypot preenchido)
 */
export function isBot(honeypotValue: string): boolean {
  return honeypotValue.trim().length > 0;
}

/**
 * Sanitiza input removendo caracteres perigosos
 * @param input - String para sanitizar
 * @returns string - String sanitizada
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript:
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .substring(0, 1000); // Limita tamanho
}