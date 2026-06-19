import type { Category } from '../types'

export function CategoryLegend({ categories }: { categories: Category[] }) {
  return (
    <ul className="legend" aria-label="일정 분류">
      {categories.map((c) => (
        <li key={c.id}>
          <span className="legend-dot" style={{ backgroundColor: c.color }} />
          {c.label}
        </li>
      ))}
    </ul>
  )
}
