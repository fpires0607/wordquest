export function speak(text: string) {
  if (!('speechSynthesis' in window)) return
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-US'
  u.rate = 0.85
  const voice = speechSynthesis.getVoices().find((v) => v.lang.startsWith('en'))
  if (voice) u.voice = voice
  speechSynthesis.cancel()
  speechSynthesis.speak(u)
}
export const canSpeak = () => typeof window !== 'undefined' && 'speechSynthesis' in window
