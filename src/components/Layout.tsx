import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { BrandMark } from './icons'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="ambient" aria-hidden="true" />
      <nav className="site-nav">
        <NavLink to="/" className="brand">
          <span className="brand-mark">
            <BrandMark />
          </span>
          <span className="brand-name">Da Vinci PAS System</span>
        </NavLink>
        <div className="nav-links">
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Prior Auth
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            About
          </NavLink>
        </div>
      </nav>

      <div className="app-shell">{children}</div>

      <footer className="site-footer">
        <span>&copy; {new Date().getFullYear()} Khalilur Rahman &mdash; built on the Da Vinci PAS FHIR IG</span>
        <a href="https://github.com/khalilurrrahmanridoykhan/davinci-pas-system" target="_blank" rel="noreferrer">
          Source on GitHub
        </a>
      </footer>
    </>
  )
}
