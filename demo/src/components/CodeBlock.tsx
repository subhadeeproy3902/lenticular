import { useEffect, useState } from 'react'
import { CopyButton } from './CopyButton'
import type { HighlighterCore } from 'shiki'

type Lang = 'tsx' | 'ts' | 'bash' | 'json'

// One async-loaded highlighter, shared across instances. Shiki + grammars
// load via dynamic import so the initial demo bundle stays light.
let highlighterPromise: Promise<HighlighterCore> | null = null

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = (async () => {
      const [{ createHighlighterCore }, { createJavaScriptRegexEngine }, theme, tsx, bash, json] =
        await Promise.all([
          import('shiki/core'),
          import('shiki/engine/javascript'),
          import('shiki/themes/github-dark-default.mjs'),
          import('shiki/langs/tsx.mjs'),
          import('shiki/langs/bash.mjs'),
          import('shiki/langs/json.mjs'),
        ])
      return createHighlighterCore({
        themes: [theme.default],
        langs: [tsx.default, bash.default, json.default],
        engine: createJavaScriptRegexEngine(),
      })
    })()
  }
  return highlighterPromise
}

const cache = new Map<string, string>()

export function CodeBlock({
  code,
  lang = 'tsx',
  label,
  compact = false,
}: {
  code: string
  lang?: Lang
  label: string
  compact?: boolean
}) {
  const cacheKey = `${lang}:${code}`
  const [html, setHtml] = useState<string | null>(
    () => cache.get(cacheKey) ?? null,
  )

  useEffect(() => {
    let cancelled = false
    const cached = cache.get(cacheKey)
    if (cached) {
      setHtml(cached)
      return
    }
    getHighlighter()
      .then((hl) => {
        if (cancelled) return
        const out = hl.codeToHtml(code, {
          lang: lang === 'ts' ? 'tsx' : lang,
          theme: 'github-dark-default',
        })
        cache.set(cacheKey, out)
        setHtml(out)
      })
      .catch(() => {
        if (!cancelled) setHtml(null)
      })
    return () => {
      cancelled = true
    }
  }, [cacheKey, code, lang])

  return (
    <div className={`code-block${compact ? '' : ' code-block--multi'}`}>
      {html ? (
        <div
          className="code-block-rendered"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <code>{code}</code>
      )}
      <CopyButton text={code} label={label} />
    </div>
  )
}
