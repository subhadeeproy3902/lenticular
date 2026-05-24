import { Lenticular } from 'lenticular-fx'

function AvatarFront() {
  return (
    <div className="avatar avatar--day" aria-hidden="true">
      <div className="avatar-glow avatar-glow--a" />
      <div className="avatar-glow avatar-glow--b" />
      <div className="avatar-glow avatar-glow--c" />
    </div>
  )
}

function AvatarBack() {
  return (
    <div className="avatar avatar--night" aria-hidden="true">
      <div className="avatar-glow avatar-glow--a" />
      <div className="avatar-glow avatar-glow--b" />
      <div className="avatar-glow avatar-glow--c" />
    </div>
  )
}

export function AvatarExample({ slices = 20 }: { slices?: number }) {
  return (
    <Lenticular
      slices={slices}
      ease={0.08}
      triggerParent
      front={<AvatarFront />}
      back={<AvatarBack />}
    />
  )
}
