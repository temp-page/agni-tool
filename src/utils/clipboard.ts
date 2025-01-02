/**
 * @abstract 浏览器剪贴板
 * @link https://github.com/feross/clipboard-copy/blob/master/index.js
 */
async function clipboard(text?: string) {
  if (typeof text !== 'string') return

  const copyToClipboardFallback = (text: string) => {
    const textArea = window.document.createElement('textarea')
    textArea.value = text
    window.document.body.appendChild(textArea)
    textArea.select()

    const success = window.document.execCommand('copy')
    window.document.body.removeChild(textArea)

    if (!success) {
      throw new DOMException('The request is not allowed', 'NotAllowedError')
    }
  }

  if (window.navigator.clipboard) {
    try {
      await window.navigator.clipboard.writeText(text)
    } catch (error) {
      throw error ?? new DOMException('The request is not allowed', 'NotAllowedError')
    }
  } else {
    copyToClipboardFallback(text)
  }
}

export default clipboard
