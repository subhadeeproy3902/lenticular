import { Lenticular } from 'lenticular-fx'
import { Stage } from './Stage'

function AlbumCover({ variant }: { variant: 'a' | 'b' }) {
  const a = variant === 'a'
  return (
    <div className={`album${a ? ' album--dusk' : ' album--dawn'}`}>
      <div className="album-art" aria-hidden="true">
        <div className="album-art-blob album-art-blob-1" />
        <div className="album-art-blob album-art-blob-2" />
        <div className="album-art-blob album-art-blob-3" />
      </div>
      <div className="album-meta">
        <span className="album-title">{a ? 'Dusk Tapes' : 'Dawn Drift'}</span>
        <span className="album-artist">{a ? 'Lo · 2024' : 'Hi · 2025'}</span>
      </div>
    </div>
  )
}

export function AlbumCoverExample({ slices = 12 }: { slices?: number }) {
  return (
    <Lenticular
      slices={slices}
      ease={0.16}
      front={<Stage width={220} height={240}><AlbumCover variant="a" /></Stage>}
      back={<Stage width={220} height={240}><AlbumCover variant="b" /></Stage>}
    />
  )
}
