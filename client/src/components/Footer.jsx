import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-[#1a1c1c] text-[#cfc4c5] mt-16" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <div className="w-full py-16 px-6 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="text-[28px] font-black text-[#f9f9f9] mb-4">EduPro</div>
            <p className="text-[14px] leading-relaxed">
              The world's leading online learning platform for creative professionals.
            </p>
          </div>
          <div>
            <h4 className="text-[12px] font-bold uppercase tracking-widest text-[#f9f9f9] mb-4">Platform</h4>
            <ul className="flex flex-col gap-3">
              <li><Link to="/courses" className="text-[14px] hover:text-[#f9f9f9] transition-colors">Browse Courses</Link></li>
              <li><Link to="/publish" className="text-[14px] hover:text-[#f9f9f9] transition-colors">Become an Instructor</Link></li>
              <li><Link to="/dashboard" className="text-[14px] hover:text-[#f9f9f9] transition-colors">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[12px] font-bold uppercase tracking-widest text-[#f9f9f9] mb-4">Company</h4>
            <ul className="flex flex-col gap-3">
              <li><a href="#" className="text-[14px] hover:text-[#f9f9f9] transition-colors">About Us</a></li>
              <li><a href="#" className="text-[14px] hover:text-[#f9f9f9] transition-colors">Careers</a></li>
              <li><a href="#" className="text-[14px] hover:text-[#f9f9f9] transition-colors">Press</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[12px] font-bold uppercase tracking-widest text-[#f9f9f9] mb-4">Support</h4>
            <ul className="flex flex-col gap-3">
              <li><a href="#" className="text-[14px] hover:text-[#f9f9f9] transition-colors">Help Center</a></li>
              <li><a href="#" className="text-[14px] hover:text-[#f9f9f9] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-[14px] hover:text-[#f9f9f9] transition-colors">Terms of Use</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-[13px]">© 2024 EduPro Global. All rights reserved.</div>
          <div className="flex gap-4">
            <a href="#" className="text-[13px] hover:text-[#f9f9f9] transition-colors">Twitter</a>
            <a href="#" className="text-[13px] hover:text-[#f9f9f9] transition-colors">Instagram</a>
            <a href="#" className="text-[13px] hover:text-[#f9f9f9] transition-colors">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
