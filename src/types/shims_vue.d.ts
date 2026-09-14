// declare module '*.vue' {
//   import { App } from 'vue'
//   export default App.Component
// }

declare module '*.vue' {
  import { type Component } from 'vue'
  const component: Component
  export default component
}

declare module '*/lyric-player/index.js' {
  const Lyric: any
  export default Lyric
}

declare module '@/utils/musicSdk' {
  const musicSdk: any
  export default musicSdk
}

