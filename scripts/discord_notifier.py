"""
Envio de notícias para Discord via Webhook (sem expor tokens de bot).

Segurança:
- Não commit o .env (use .env.example como referência)
- Use variável de ambiente DISCORD_WEBHOOK_URL
- Nenhum segredo deve ser exposto no frontend

Uso básico:
    from scripts.discord_notifier import send_news_to_discord
    send_news_to_discord([{
        "title": "Exemplo de notícia",
        "summary": "Resumo curto da notícia...",
        "url": "https://exemplo.com/noticia",
        "image_url": "https://exemplo.com/imagem.jpg",
        "source": "Portas Abertas",
        "date": "2025-10-08",
        "tags": ["teologia", "missões"],
    }])

Este módulo é ideal para ser chamado ao final do pipeline do scraper.
"""

from __future__ import annotations

import os
import math
import time
import json
from typing import List, Dict, Optional

try:
    from dotenv import load_dotenv
    # Carrega variáveis padrão de .env (se existir)
    load_dotenv()
    # Carrega .env.local na raiz do projeto (para Vite/Node + Python local)
    import os as _os
    _project_root = _os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))
    _env_local_path = _os.path.join(_project_root, '.env.local')
    if _os.path.exists(_env_local_path):
        load_dotenv(_env_local_path)
except Exception:
    # dotenv é opcional; apenas necessário em desenvolvimento local
    pass

import requests
 
# Domínio do site para links de resumo enviados ao Discord
SITE_URL = os.getenv("SITE_URL", "https://www.igrejadarecon.com.br/")


def _chunk(items: List[Dict], size: int) -> List[List[Dict]]:
    return [items[i : i + size] for i in range(0, len(items), size)]


def _format_embed(item: Dict) -> Dict:
    title = item.get("title") or "Notícia"
    url = item.get("url")
    summary = item.get("summary") or item.get("description") or ""
    image_url = item.get("image_url") or item.get("image")
    source = item.get("source") or item.get("origin") or "Fonte"
    date = item.get("date") or item.get("published_at") or ""
    tags = item.get("tags") or []

    # Limita descrição para evitar erro de payload > 6000 chars no Discord
    if summary and len(summary) > 500:
        summary = summary[:497] + "..."

    embed = {
        "title": title,
        "url": url,
        "description": summary,
        "color": 5814783,  # azul aproximado
        "fields": [
            {"name": "Fonte", "value": str(source), "inline": True},
            {"name": "Data", "value": str(date), "inline": True},
        ],
    }

    if tags:
        tags_str = ", ".join(map(str, tags))
        embed["fields"].append({"name": "Tags", "value": tags_str, "inline": False})

    if image_url:
        embed["image"] = {"url": image_url}

    return embed


def send_news_to_discord(
    items: List[Dict],
    webhook_url: Optional[str] = None,
    *,
    chunk_size: int = 5,
    sleep_between_batches: float = 1.0,
    dry_run: bool = False,
) -> Dict:
    """
    Envia uma lista de notícias em embeds para um canal do Discord via Webhook.

    - items: lista de dicionários com chaves como title, summary, url, image_url, source, date, tags
    - webhook_url: opcional; se não informado, usa a variável de ambiente DISCORD_WEBHOOK_URL
    - chunk_size: quantidade de embeds por mensagem (máx. 10 pelo Discord, usamos 5 por segurança)
    - sleep_between_batches: tempo (s) entre envios para evitar rate limit
    - dry_run: se True, não envia; apenas retorna payloads formatados
    """

    webhook = webhook_url or os.getenv("DISCORD_WEBHOOK_URL")
    if not webhook:
        raise ValueError(
            "DISCORD_WEBHOOK_URL não definido. Configure no .env (copie de .env.example) ou passe como parâmetro."
        )

    embeds = [_format_embed(it) for it in items]
    batches = _chunk(embeds, max(1, min(10, chunk_size)))

    results = {"sent": 0, "failed": 0, "responses": []}

    for i, batch in enumerate(batches):
        payload = {"embeds": batch}

        if dry_run:
            results["responses"].append({"dry_run": True, "payload": payload})
            results["sent"] += 1
            continue

        try:
            resp = requests.post(
                webhook,
                data=json.dumps(payload),
                headers={"Content-Type": "application/json"},
                timeout=15,
            )
            ok = 200 <= resp.status_code < 300
            results["responses"].append({
                "status": resp.status_code,
                "ok": ok,
                "text": resp.text[:500],
            })
            if ok:
                results["sent"] += 1
            else:
                results["failed"] += 1
        except Exception as e:
            results["responses"].append({"error": str(e)})
            results["failed"] += 1

        # intervalo entre lotes para evitar rate limits
        if i < len(batches) - 1 and sleep_between_batches > 0:
            time.sleep(sleep_between_batches)

    return results


if __name__ == "__main__":
    # Exemplo rápido de teste: usa DISCORD_WEBHOOK_URL do ambiente
    demo_items = [
        {
            "title": "Reconciliação News — Integração com Discord",
            "summary": "Mensagem de teste de integração. Se você está vendo isto no canal, a configuração funcionou.",
            "url": SITE_URL,
            "image_url": None,
            "source": "MBDaReconciliação",
            "date": "2025-10-08",
            "tags": ["teste", "discord", "webhook"],
        }
    ]

    try:
        result = send_news_to_discord(demo_items)
        print("Resultado do envio:", result)
    except Exception as exc:
        print("Falha no envio:", exc)