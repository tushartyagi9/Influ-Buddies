import './FilterBar.css';

export default function FilterBar({ filters, onChange }) {
  function handleChange(e) {
    const { name, value } = e.target;
    onChange({ ...filters, [name]: value });
  }

  return (
    <section className="filter-bar">
      <input
        name="search"
        value={filters.search || ''}
        onChange={handleChange}
        placeholder="Search by name..."
      />
      <input
        name="niche"
        value={filters.niche || ''}
        onChange={handleChange}
        placeholder="Niche (e.g. beauty, dance)"
      />
      <input
        name="location"
        value={filters.location || ''}
        onChange={handleChange}
        placeholder="Location"
      />
      <input
        name="platform"
        value={filters.platform || ''}
        onChange={handleChange}
        placeholder="Platform (e.g. instagram)"
      />
      <select name="gender" value={filters.gender || ''} onChange={handleChange}>
        <option value="">Any gender</option>
        <option value="female">Female</option>
        <option value="male">Male</option>
        <option value="other">Other</option>
      </select>
    </section>
  );
}

