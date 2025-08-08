/**
 * Rate Limiter para prevenir spam e ataques de força bruta
 * Limita tentativas por IP/sessão com cooldown inteligente
 */

interface RateLimitAttempt {
  timestamp: number;
  count: number;
}

class RateLimiter {
  private attempts: Map<string, RateLimitAttempt> = new Map();
  private readonly maxAttempts: number;
  private readonly timeWindow: number; // em milissegundos
  private readonly cooldownPeriod: number; // em milissegundos

  constructor(
    maxAttempts: number = 3,
    timeWindow: number = 300000, // 5 minutos
    cooldownPeriod: number = 900000 // 15 minutos
  ) {
    this.maxAttempts = maxAttempts;
    this.timeWindow = timeWindow;
    this.cooldownPeriod = cooldownPeriod;
  }

  /**
   * Verifica se o usuário pode fazer uma tentativa
   * @param identifier - Identificador único (IP, sessionId, etc.)
   * @returns boolean - true se pode tentar, false se bloqueado
   */
  canAttempt(identifier: string): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(identifier);

    // Se não há tentativas anteriores, permite
    if (!attempt) {
      return true;
    }

    // Se passou do período de cooldown, reseta
    if (now - attempt.timestamp > this.cooldownPeriod) {
      this.attempts.delete(identifier);
      return true;
    }

    // Se ainda está na janela de tempo e não excedeu o limite
    if (now - attempt.timestamp < this.timeWindow) {
      return attempt.count < this.maxAttempts;
    }

    // Se passou da janela de tempo mas não do cooldown, reseta contador
    attempt.count = 0;
    attempt.timestamp = now;
    return true;
  }

  /**
   * Registra uma tentativa
   * @param identifier - Identificador único
   * @param success - Se a tentativa foi bem-sucedida
   */
  recordAttempt(identifier: string, success: boolean = false): void {
    const now = Date.now();
    const attempt = this.attempts.get(identifier);

    if (success) {
      // Se foi bem-sucedida, remove do rate limiting
      this.attempts.delete(identifier);
      return;
    }

    if (!attempt) {
      // Primeira tentativa falhada
      this.attempts.set(identifier, {
        timestamp: now,
        count: 1
      });
    } else {
      // Incrementa tentativas falhadas
      if (now - attempt.timestamp < this.timeWindow) {
        attempt.count++;
      } else {
        // Nova janela de tempo
        attempt.timestamp = now;
        attempt.count = 1;
      }
    }
  }

  /**
   * Retorna tempo restante de bloqueio em segundos
   * @param identifier - Identificador único
   * @returns number - Segundos restantes de bloqueio (0 se não bloqueado)
   */
  getTimeRemaining(identifier: string): number {
    const attempt = this.attempts.get(identifier);
    if (!attempt || attempt.count < this.maxAttempts) {
      return 0;
    }

    const now = Date.now();
    const timeElapsed = now - attempt.timestamp;
    const timeRemaining = this.cooldownPeriod - timeElapsed;

    return Math.max(0, Math.ceil(timeRemaining / 1000));
  }

  /**
   * Limpa tentativas antigas (manutenção)
   */
  cleanup(): void {
    const now = Date.now();
    for (const [identifier, attempt] of this.attempts.entries()) {
      if (now - attempt.timestamp > this.cooldownPeriod) {
        this.attempts.delete(identifier);
      }
    }
  }
}

// Instância global para formulário de contato
export const contactFormLimiter = new RateLimiter(
  3,      // 3 tentativas
  300000, // 5 minutos
  900000  // 15 minutos de cooldown
);

// Instância para validação de email (mais permissiva)
export const emailValidationLimiter = new RateLimiter(
  10,     // 10 tentativas
  60000,  // 1 minuto
  300000  // 5 minutos de cooldown
);

// Limpeza automática a cada 30 minutos
setInterval(() => {
  contactFormLimiter.cleanup();
  emailValidationLimiter.cleanup();
}, 1800000);

export default RateLimiter;