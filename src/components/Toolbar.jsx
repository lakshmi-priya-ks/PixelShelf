import { Search, X, ArrowUpDown } from 'lucide-react'

export default function Toolbar({ query, setQuery, sort, setSort }) {
  return (
    <section className="toolbar">
      <div className="search-box">
        <Search size={17} />

        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search photos by filename..."
        />

        {query && (
          <button onClick={() => setQuery('')} aria-label="Clear search">
            <X size={15} />
          </button>
        )}
      </div>

      <label className="sort-control">
        <ArrowUpDown size={15} />

        <select value={sort} onChange={(event) => setSort(event.target.value)}>
          <option value="name">Name</option>
          <option value="newest">Newest</option>
          <option value="size">Largest file</option>
        </select>
      </label>
    </section>
  )
}
