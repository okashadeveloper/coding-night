import React, { useState, useEffect, useRef } from 'react';

const SearchFilterBar = ({
  searchPlaceholder = 'Search...',
  searchValue = '',
  onSearchChange,
  filters = [],
  onClear,
  debounceMs = 300,
  extra = null
}) => {
  const [localSearch, setLocalSearch] = useState(searchValue);
  const timerRef = useRef(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    setLocalSearch(searchValue);
  }, [searchValue]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      onSearchChange?.(localSearch);
    }, debounceMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [localSearch, debounceMs]);

  const hasActiveFilters =
    localSearch.trim() !== '' || filters.some((f) => f.value !== '' && f.value != null);

  const handleClear = () => {
    setLocalSearch('');
    onSearchChange?.('');
    onClear?.();
  };

  return (
    <div className="glass-panel mb-6 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="min-w-[180px] flex-1">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="input-dark"
          />
        </div>

        {filters.map((filter) => (
          <div key={filter.key} className="min-w-[140px]">
            <select
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              className="select-dark"
            >
              <option value="">{filter.label}</option>
              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ))}

        <button
          type="button"
          onClick={handleClear}
          disabled={!hasActiveFilters}
          className="btn-ghost whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-40"
        >
          Clear filters
        </button>

        {extra}
      </div>
    </div>
  );
};

export default SearchFilterBar;
