export type TokenType = "keyword" | "type" | "string" | "comment" | "number" | "function" | "macro" | "operator" | "plain"
export interface Token { type: TokenType; text: string }

type Mode = "normal" | "block-comment" | "template" | "triple-single" | "triple-double"

const KEYWORDS: Record<string, Set<string>> = {
  rust: new Set("as async await break const continue crate dyn else enum extern false fn for if impl in let loop match mod move mut pub ref return self Self static struct super trait true type unsafe use where while".split(" ")),
  javascript: new Set("async await break case catch class const continue default delete do else export extends false finally for from function if import in instanceof let new null of return static super switch this throw true try typeof undefined var void while yield".split(" ")),
  python: new Set("and as assert async await break class continue def del elif else except False finally for from global if import in is lambda None nonlocal not or pass raise return True try while with yield".split(" ")),
  bash: new Set("case do done elif else esac export fi for function if in local readonly return then while".split(" ")),
}
const ALIASES: Record<string, string> = { rs: "rust", ts: "javascript", tsx: "javascript", js: "javascript", jsx: "javascript", typescript: "javascript", py: "python", sh: "bash", zsh: "bash", scss: "css" }

function push(tokens: Token[], type: TokenType, text: string) {
  if (!text) return
  const previous = tokens.at(-1)
  if (previous?.type === type) previous.text += text
  else tokens.push({ type, text })
}

function quotedEnd(line: string, start: number, quote: string) {
  let index = start + quote.length
  while (index < line.length) {
    if (line[index] === "\\") index += 2
    else if (line.startsWith(quote, index)) return index + quote.length
    else index += 1
  }
  return line.length
}

/** Stateful, dependency-free tokenizer adapter for read-only code previews. */
export function tokenizeCode(code: string, requestedLanguage: string): Token[][] {
  const language = ALIASES[requestedLanguage.toLowerCase()] ?? requestedLanguage.toLowerCase()
  const keywords = KEYWORDS[language] ?? KEYWORDS.javascript
  let mode: Mode = "normal"

  return code.split("\n").map((line) => {
    const tokens: Token[] = []
    let index = 0
    while (index < line.length) {
      if (mode === "block-comment") {
        const end = line.indexOf("*/", index)
        if (end < 0) { push(tokens, "comment", line.slice(index)); break }
        push(tokens, "comment", line.slice(index, end + 2)); index = end + 2; mode = "normal"; continue
      }
      if (mode === "template") {
        const end = quotedEnd(line, Math.max(-1, index - 1), "`")
        push(tokens, "string", line.slice(index, end))
        if (line.slice(index, end).endsWith("`")) mode = "normal"
        index = end; continue
      }
      if (mode === "triple-single" || mode === "triple-double") {
        const quote = mode === "triple-single" ? "'''" : '\"\"\"'
        const end = line.indexOf(quote, index)
        if (end < 0) { push(tokens, "string", line.slice(index)); break }
        push(tokens, "string", line.slice(index, end + 3)); index = end + 3; mode = "normal"; continue
      }

      const rest = line.slice(index)
      if (["javascript", "rust", "css"].includes(language) && rest.startsWith("/*")) {
        const end = line.indexOf("*/", index + 2)
        if (end < 0) { push(tokens, "comment", rest); mode = "block-comment"; break }
        push(tokens, "comment", line.slice(index, end + 2)); index = end + 2; continue
      }
      const slashComment = ["javascript", "rust"].includes(language) && rest.startsWith("//")
      const hashComment = ["python", "bash", "toml"].includes(language) && rest.startsWith("#")
      if (slashComment || hashComment) { push(tokens, "comment", rest); break }
      if (language === "python" && (rest.startsWith("'''") || rest.startsWith('\"\"\"'))) {
        const quote = rest.slice(0, 3)
        const end = line.indexOf(quote, index + 3)
        if (end < 0) { push(tokens, "string", rest); mode = quote === "'''" ? "triple-single" : "triple-double"; break }
        push(tokens, "string", line.slice(index, end + 3)); index = end + 3; continue
      }
      if (language === "javascript" && rest[0] === "`") {
        const end = quotedEnd(line, index, "`")
        push(tokens, "string", line.slice(index, end))
        if (!line.slice(index, end).endsWith("`")) mode = "template"
        index = end; continue
      }
      if (rest[0] === "\"" || rest[0] === "'") {
        const end = quotedEnd(line, index, rest[0])
        push(tokens, "string", line.slice(index, end)); index = end; continue
      }
      const whitespace = rest.match(/^\s+/)?.[0]
      if (whitespace) { push(tokens, "plain", whitespace); index += whitespace.length; continue }
      const number = rest.match(/^(?:0x[\da-f_]+|0b[01_]+|\d[\d_]*(?:\.\d+)?)/i)?.[0]
      if (number) { push(tokens, "number", number); index += number.length; continue }
      const identifier = rest.match(/^[A-Za-z_$][\w$-]*/)?.[0]
      if (identifier) {
        const after = line.slice(index + identifier.length)
        const type: TokenType = keywords.has(identifier) ? "keyword" : /^[A-Z]/.test(identifier) ? "type" : /^\s*\(/.test(after) ? "function" : "plain"
        push(tokens, type, identifier); index += identifier.length; continue
      }
      const operator = rest.match(/^(?:===?|!==?|=>|->|::|&&|\|\||\?\?|\.\.?=?|[+\-*/%&|^~<>=!?.,:;@#{}()[\]])/)?.[0]
      if (operator) { push(tokens, "operator", operator); index += operator.length; continue }
      push(tokens, "plain", rest[0]); index += 1
    }
    return tokens
  })
}
