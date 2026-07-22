import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-white text-[#111111] border-t border-[#EAEAEA]" style={{ fontFamily: 'Kanit, Inter, Prompt, Mitr, sans-serif' }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="py-6 md:h-24 md:py-0 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* ── Brand Logo (Left) ── */}
          <div className="flex-1 flex justify-center md:justify-start">
            <Link to="/" className="text-xl font-bold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] rounded-sm">
              UDEE
            </Link>
          </div>
          
          {/* ── Navigation Links (Center) ── */}
          <nav className="flex items-center justify-center gap-8 text-sm font-medium text-[#666666]">
            <Link to="/products" className="hover:text-[#111111] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] rounded-sm">
              Products
            </Link>
            <Link to="/about" className="hover:text-[#111111] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] rounded-sm">
              About
            </Link>
            <Link to="/contact" className="hover:text-[#111111] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] rounded-sm">
              Contact
            </Link>
          </nav>
          
          {/* ── Copyright (Right) ── */}
          <div className="flex-1 flex justify-center md:justify-end">
            <span className="text-sm font-medium text-[#888888]">
              © {new Date().getFullYear()} Udee
            </span>
          </div>

        </div>
      </div>
    </footer>
  )
}

export default Footer
