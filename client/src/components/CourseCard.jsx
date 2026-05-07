import { Link } from 'react-router-dom'
import { optimizeImageUrl } from '../lib/image'

export default function CourseCard({
  course,
  highlight = false,
  showSave = false,
  isSaved = false,
  onToggleSave,
  progressPercent = null,
  ctaLabel = null,
}) {
  const { _id, title, instructor, category, rating, reviewCount, isBestseller, isNew, thumbnail } = course

  return (
    <Link
      to={`/courses/${_id}`}
      className={`course-card block border hover:border-black transition-all group ${
        highlight
          ? 'bg-[#ceef83] border-black'
          : 'bg-white border-[#cfc4c5]'
      }`}
    >
      <div className="aspect-[16/10] overflow-hidden">
        <img
          className="course-thumb w-full h-full object-cover"
          src={optimizeImageUrl(thumbnail || 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&q=80')}
          alt={title}
          loading="lazy"
          decoding="async"
          width="800"
          height="500"
        />
      </div>
      <div className="p-5">
        {showSave && (
          <div className="flex justify-end mb-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onToggleSave?.(course)
              }}
              className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest border ${
                isSaved ? 'bg-[#ceef83] border-black text-[#151f00]' : 'border-[#cfc4c5] text-[#4c4546] hover:border-black'
              }`}
            >
              {isSaved ? 'Saved' : 'Save'}
            </button>
          </div>
        )}
        <div className="flex gap-2 mb-2">
          <span className="px-2 py-0.5 border border-[#cfc4c5] text-[10px] font-bold uppercase tracking-wider">
            {category}
          </span>
        </div>
        <h3 className="text-[17px] font-bold leading-tight mb-1 group-hover:underline line-clamp-2">
          {title}
        </h3>
        <p className={`text-[13px] mb-3 ${highlight ? 'text-[#151f00]/70' : 'text-[#4c4546]'}`}>
          {instructor}
        </p>
        <div className="flex items-center gap-1 mb-3">
          <span className="text-[13px] font-bold text-[#4d6705]">{rating?.toFixed(1)}</span>
          <span className="text-yellow-500 text-[13px]">{'★'.repeat(Math.round(rating || 0))}</span>
          <span className="text-[12px] text-[#4c4546]">({reviewCount?.toLocaleString()})</span>
        </div>
        <div className={`flex items-center justify-between pt-3 border-t ${highlight ? 'border-black' : 'border-[#cfc4c5]'}`}>
          <span className="text-[12px] font-bold uppercase tracking-widest text-[#4c4546]">
            {ctaLabel || 'View Course'}
          </span>
          {isBestseller && (
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#526d0d] bg-[#ceef83] px-2 py-0.5">
              Bestseller
            </span>
          )}
          {isNew && !isBestseller && (
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#526d0d] bg-[#ceef83] px-2 py-0.5">
              New
            </span>
          )}
        </div>
        {typeof progressPercent === 'number' && (
          <div className="mt-3">
            <div className="w-full bg-[#eeeeee] h-1">
              <div className="bg-[#4d6705] h-1" style={{ width: `${Math.max(0, Math.min(100, progressPercent))}%` }} />
            </div>
            <p className="text-[11px] text-[#4c4546] mt-1 font-bold uppercase tracking-wider">{progressPercent}% complete</p>
          </div>
        )}
      </div>
    </Link>
  )
}
