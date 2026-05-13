import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../lib/api'
import { useAuth } from '../context/useAuth'

const STEPS = ['BASICS', 'CONTENT', 'PRICING', 'PUBLISH']

export default function Publish() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    category: '',
    price: 0,
    description: '',
  })

  const [files, setFiles] = useState({
    thumbnail: null,
    video: null,
    pdf: null,
  })

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleFileChange(e) {
    setFiles(prev => ({ ...prev, [e.target.name]: e.target.files[0] }))
  }

  async function handleSubmit() {
    setSubmitting(true)
    try {
      const formData = new FormData()
      Object.keys(form).forEach(key => formData.append(key, form[key]))
      if (files.thumbnail) formData.append('thumbnail', files.thumbnail)
      if (files.video) formData.append('video', files.video)
      if (files.pdf) formData.append('pdf', files.pdf)

      await api.post('/api/admin/upload-course', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      setSubmitted(true)
      setTimeout(() => navigate('/dashboard'), 2000)
    } catch (error) {
      console.error('Upload failed:', error)
      alert(error.response?.data?.message || 'Upload failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <Navbar />

      {submitted && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center">
          <div className="bg-white p-12 border border-black max-w-md w-full text-center">
            <span className="material-symbols-outlined text-[64px] text-[#4d6705]">check_circle</span>
            <h2 className="text-[28px] font-black mt-4 mb-2">Submitted!</h2>
            <p className="text-[16px] text-[#4c4546]">Your course has been sent for review. Redirecting to dashboard...</p>
          </div>
        </div>
      )}

      <main className="pt-[120px] pb-32 px-6 max-w-[1200px] mx-auto">

        {/* STEPPER */}
        <div className="mb-16">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {STEPS.map((step, i) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    i < 3 ? 'bg-black text-white' : 'border-2 border-black bg-[#ceef83] text-[#526d0d]'
                  }`}>
                    {i < 3
                      ? <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'wght' 700" }}>check</span>
                      : <span className="font-bold text-[14px]">4</span>
                    }
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-black">{step}</span>
                </div>
                {i < STEPS.length - 1 && <div className="flex-1 h-[1px] bg-black mx-4 mb-5"></div>}
              </div>
            ))}
          </div>
        </div>

        <section className="mb-12">
          <h1 className="text-[48px] font-black tracking-tight leading-tight mb-4">Review &amp; Publish</h1>
          <p className="text-[18px] text-[#4c4546] max-w-2xl">
            Almost there. Please review your course details below. This is exactly how your course will appear to potential students in the marketplace.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* PREVIEW CARD */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white border border-black p-1">
              <div className="aspect-video bg-[#e8e8e8] overflow-hidden border-b border-black">
                <img
                  className="w-full h-full object-cover"
                  src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80"
                  alt="Course Preview"
                />
              </div>
              <div className="p-6">
                <div className="flex gap-2 mb-4">
                  <span className="px-2 py-1 border border-black text-[10px] font-bold uppercase">Design</span>
                  <span className="px-2 py-1 border border-black text-[10px] font-bold uppercase">Architecture</span>
                </div>
                <h3 className="text-[28px] font-bold leading-tight mb-2">{form.title}</h3>
                <p className="text-[16px] text-[#4c4546] mb-6">Learn the art of negative space and structural clarity from industry leaders.</p>
                <div className="flex items-center justify-between pt-6 border-t border-[#cfc4c5]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-black"></div>
                    <span className="text-[12px] font-bold">{user?.name || 'Instructor'}</span>
                  </div>
                  <span className="text-[28px] font-bold">${form.price}</span>
                </div>
              </div>
            </div>

            <div className="p-6 border border-[#cfc4c5] bg-[#f3f3f4]">
              <h4 className="text-[12px] font-bold uppercase tracking-widest mb-4">Marketplace Visibility</h4>
              <ul className="flex flex-col gap-3">
                {[
                  { text: 'Featured in New Courses', active: true },
                  { text: 'Search Engine Indexed', active: true },
                  { text: 'Global Promotional Access', active: false },
                ].map(item => (
                  <li key={item.text} className="flex items-center gap-3 text-[16px]">
                    <span className={`material-symbols-outlined text-[20px] ${item.active ? 'text-[#4d6705]' : 'text-[#cfc4c5]'}`}>
                      {item.active ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                    <span className={item.active ? '' : 'text-[#4c4546]'}>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* SUMMARY */}
          <div className="lg:col-span-8 flex flex-col gap-8">

            {/* BASICS */}
            <div className="border-b border-[#cfc4c5] pb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-[32px] font-bold">01 Basics</h2>
                <button className="text-[14px] font-bold border-b border-black hover:text-[#4d6705] transition-all">EDIT</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                <div>
                  <label className="block text-[12px] font-bold uppercase tracking-tight text-[#4c4546] mb-1">Course Title</label>
                  <input name="title" value={form.title} onChange={handleChange}
                    className="w-full text-[18px] font-medium border-b border-[#cfc4c5] focus:border-black focus:outline-none bg-transparent py-1" />
                </div>
                <div>
                  <label className="block text-[12px] font-bold uppercase tracking-tight text-[#4c4546] mb-1">Category</label>
                  <input name="category" value={form.category} onChange={handleChange}
                    className="w-full text-[18px] font-medium border-b border-[#cfc4c5] focus:border-black focus:outline-none bg-transparent py-1" />
                </div>
                <div className="col-span-full">
                  <label className="block text-[12px] font-bold uppercase tracking-tight text-[#4c4546] mb-1">Subtitle</label>
                  <textarea name="subtitle" value={form.subtitle} onChange={handleChange} rows={2}
                    className="w-full text-[16px] border-b border-[#cfc4c5] focus:border-black focus:outline-none bg-transparent resize-none py-1" />
                </div>
              </div>
            </div>

            {/* CONTENT */}
            <div className="border-b border-[#cfc4c5] pb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-[32px] font-bold">02 Content</h2>
                <button className="text-[14px] font-bold border-b border-black hover:text-[#4d6705] transition-all">EDIT</button>
              </div>
              <div className="flex flex-col gap-6 mt-4">
                <div className="p-6 border border-black bg-white">
                  <label className="block text-[12px] font-bold uppercase tracking-tight text-[#4c4546] mb-3">Course Thumbnail (Image)</label>
                  <input type="file" name="thumbnail" accept="image/*" onChange={handleFileChange} className="text-[14px] file:mr-4 file:py-2 file:px-4 file:border-0 file:text-[12px] file:font-bold file:uppercase file:bg-black file:text-white hover:file:bg-[#4c4546] transition-all cursor-pointer" />
                </div>
                <div className="p-6 border border-black bg-white">
                  <label className="block text-[12px] font-bold uppercase tracking-tight text-[#4c4546] mb-3">Main Lesson Video</label>
                  <input type="file" name="video" accept="video/*" onChange={handleFileChange} className="text-[14px] file:mr-4 file:py-2 file:px-4 file:border-0 file:text-[12px] file:font-bold file:uppercase file:bg-black file:text-white hover:file:bg-[#4c4546] transition-all cursor-pointer" />
                </div>
                <div className="p-6 border border-black bg-white">
                  <label className="block text-[12px] font-bold uppercase tracking-tight text-[#4c4546] mb-3">Supplementary Materials (PDF)</label>
                  <input type="file" name="pdf" accept=".pdf" onChange={handleFileChange} className="text-[14px] file:mr-4 file:py-2 file:px-4 file:border-0 file:text-[12px] file:font-bold file:uppercase file:bg-black file:text-white hover:file:bg-[#4c4546] transition-all cursor-pointer" />
                </div>
              </div>
            </div>

            {/* PRICING */}
            <div className="border-b border-[#cfc4c5] pb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-[32px] font-bold">03 Pricing</h2>
                <button className="text-[14px] font-bold border-b border-black hover:text-[#4d6705] transition-all">EDIT</button>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[12px] font-bold uppercase tracking-tight text-[#4c4546]">Course Price</span>
                <div className="flex items-center border border-[#cfc4c5] focus-within:border-black">
                  <span className="px-3 text-[18px] font-bold">$</span>
                  <input type="number" name="price" value={form.price} onChange={handleChange}
                    className="w-24 text-[18px] font-bold py-2 pr-3 focus:outline-none bg-transparent" />
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-4 flex flex-col md:flex-row gap-4 items-center">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full md:w-auto px-12 py-5 bg-[#ceef83] text-[#151f00] text-[16px] font-bold uppercase tracking-widest border border-black hover:bg-[#b2d26a] transition-all flex items-center justify-center gap-3 disabled:opacity-60"
              >
                {submitting ? 'Submitting...' : 'Submit for Approval'}
                <span className="material-symbols-outlined">send</span>
              </button>
              <button className="w-full md:w-auto px-12 py-5 border border-black text-[16px] font-bold uppercase tracking-widest hover:bg-[#e8e8e8] transition-all">
                Save as Draft
              </button>
            </div>
            <p className="text-[12px] text-[#4c4546] italic">
              By clicking Submit, you agree to the EduPro Instructor Terms &amp; Conditions and marketplace guidelines.
            </p>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}
