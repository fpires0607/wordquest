import { useState } from 'react'
import { Home } from './components/Home'
import { LevelScreen } from './components/LevelScreen'
import { WorldScreen } from './components/WorldScreen'
import { levelById } from './data/levels'
import { worldById } from './data/worlds'

type Route = { name: 'home' } | { name: 'world'; id: string } | { name: 'level'; id: string }

export default function App() {
  const [route, setRoute] = useState<Route>({ name: 'home' })

  let body
  if (route.name === 'home') {
    body = <Home onWorld={(id) => setRoute({ name: 'world', id })} />
  } else if (route.name === 'world') {
    body = <WorldScreen worldId={route.id} onBack={() => setRoute({ name: 'home' })} onLevel={(id) => setRoute({ name: 'level', id })} />
  } else {
    const level = levelById(route.id)
    const siblings = worldById(level.worldId).levelIds
    const next = siblings[siblings.indexOf(level.id) + 1]
    body = (
      <LevelScreen
        key={level.id}
        levelId={level.id}
        nextLevelId={next}
        onExit={() => setRoute({ name: 'world', id: level.worldId })}
        onNext={(id) => setRoute({ name: 'level', id })}
      />
    )
  }
  return <div className="app">{body}</div>
}
