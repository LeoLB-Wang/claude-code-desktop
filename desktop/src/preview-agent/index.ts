import { createBridge } from './bridge'

;(() => {
  ;(window as unknown as { __PREVIEW_AGENT__?: boolean }).__PREVIEW_AGENT__ = true

  const postToHost = (raw: string) => {
    const internals = (window as unknown as { __TAURI_INTERNALS__?: { invoke?: (c: string, a: unknown) => void } }).__TAURI_INTERNALS__
    if (internals?.invoke) internals.invoke('preview_message', { raw })
    // 回退（M1 证伪 IPC 时启用）：new WebSocket('ws://127.0.0.1:'+PORT+'/preview-agent') ...
  }

  const bridge = createBridge({ postToHost, location: window.location, title: document.title })
  ;(window as unknown as { __PREVIEW_BRIDGE__?: unknown }).__PREVIEW_BRIDGE__ = bridge

  const onReady = () => { bridge.reportReady(); bridge.reportNavigated() }
  if (document.readyState !== 'loading') onReady()
  else document.addEventListener('DOMContentLoaded', onReady)
  window.addEventListener('popstate', () => bridge.reportNavigated())
})()
