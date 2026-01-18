"use client"
import { useEffect, useState } from "react"

export default function Preloader() {
    // Client-only: mount the lottie-player into server-rendered #preloader-root
    useEffect(() => {
        const root = document.getElementById('preloader-root')
        if (!root) return

        const log = (...args: any[]) => console.debug('[Preloader]', ...args)
        log('mount')

        function loadLottieScript(): Promise<void> {
            return new Promise((resolve, reject) => {
                const existing = document.querySelector('script[data-lottie-player]') as HTMLScriptElement | null
                if (existing) {
                    log('lottie script already present')
                    if ((existing as any).loaded) return resolve()
                    existing.addEventListener('load', () => resolve(), { once: true })
                    existing.addEventListener('error', () => reject(new Error('lottie script failed')), { once: true })
                    return
                }

                const s = document.createElement('script')
                s.src = 'https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js'
                s.async = true
                s.setAttribute('data-lottie-player', 'true')
                s.addEventListener('load', () => {
                    ;(s as any).loaded = true
                    log('lottie script loaded')
                    resolve()
                }, { once: true })
                s.addEventListener('error', (e) => {
                    log('lottie script error', e)
                    reject(new Error('lottie script failed to load'))
                }, { once: true })
                document.head.appendChild(s)
            })
        }

        let player: HTMLElement | null = null

        const createPlayer = () => {
            try {
                player = document.createElement('lottie-player')
                player.setAttribute('src', 'https://assets-v2.lottiefiles.com/a/20cd8386-1152-11ee-b778-1f293a3fd91e/G6ZaTyemuL.lottie')
                player.setAttribute('background', 'transparent')
                player.setAttribute('speed', '1')
                player.setAttribute('loop', '')
                player.setAttribute('autoplay', '')
                player.style.width = '140px'
                player.style.height = '140px'
                root.appendChild(player)
                log('player created')
            } catch (err) {
                log('player create failed, falling back', err)
                                const spinner = document.createElement('div')
                                spinner.innerHTML = `
                                    <svg width="56" height="56" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="25" cy="25" r="20" stroke="rgba(255,255,255,0.2)" stroke-width="6" fill="none" />
                                        <path d="M45 25a20 20 0 0 1-20 20" stroke="#fff" stroke-width="6" stroke-linecap="round" fill="none">
                                            <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite" />
                                        </path>
                                    </svg>
                                `
                root.appendChild(spinner)
            }
        }

        loadLottieScript().then(createPlayer).catch(() => createPlayer())

        const hide = () => {
            const pre = document.getElementById('preloader')
            if (!pre) return
            pre.style.transition = 'opacity 300ms ease, visibility 300ms'
            pre.style.opacity = '0'
            setTimeout(() => pre.remove(), 400)
        }

        const onLoad = () => setTimeout(hide, 500)
        if (document.readyState === 'complete') {
            onLoad()
        } else {
            window.addEventListener('load', onLoad)
        }

        return () => {
            try { player?.remove() } catch {}
            window.removeEventListener('load', onLoad)
        }
    }, [])

    return null
}
