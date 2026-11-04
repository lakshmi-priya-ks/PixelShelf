import { Aperture, Images, ShieldCheck } from 'lucide-react'

export default function Sidebar({ photoCount }) {
  return (
    <aside className="sidebar">
      <a className="brand" href="#">
        <span className="brand-mark">
          <Aperture size={22} />
        </span>

        <span>
          Pixel<span>Shelf</span>
        </span>
      </a>

      <div className="side-label">LIBRARY</div>

      <div className="nav-item active">
        <Images size={18} />
        All photos
        <span>{photoCount.toLocaleString()}</span>
      </div>

      <div className="sidebar-bottom">
        <div className="privacy-card">
          <ShieldCheck size={18} />

          <div>
            <strong>Private by design</strong>
            <p>Your photos stay on this device. Nothing is uploaded.</p>
          </div>
        </div>

        <div className="sidebar-foot">PIXELSHELF · PHOTO BROWSER</div>
      </div>
    </aside>
  )
}
