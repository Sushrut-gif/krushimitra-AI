import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X, Check } from 'lucide-react';

export default function SearchableSelect({
  label,
  options = [], // [{ id, nameMr, nameEn, ... }] or string array
  value,
  onChange,
  placeholder = 'निवडा...',
  disabled = false,
  disabledMessage = 'आधी वरील पर्याय निवडा',
  icon: Icon,
  required = false,
  allowCustomOption = false,
  customOptionLabel = 'इतर गाव (स्वतः टाईप करा)',
  onCustomSelected,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Normalize options into uniform shape: { value, labelMr, labelEn }
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === 'string') {
      return { value: opt, labelMr: opt, labelEn: '' };
    }
    return {
      value: opt.nameMr || opt.value || opt.id,
      labelMr: opt.nameMr || opt.label || opt.value,
      labelEn: opt.nameEn || '',
      raw: opt,
    };
  });

  // Filter options based on Marathi or English search
  const filteredOptions = normalizedOptions.filter((opt) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    const matchMr = opt.labelMr.toLowerCase().includes(query);
    const matchEn = opt.labelEn.toLowerCase().includes(query);
    return matchMr || matchEn;
  });

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  // Display label for currently selected value
  const selectedItem = normalizedOptions.find((opt) => opt.value === value);
  const displayLabel = selectedItem
    ? selectedItem.labelEn
      ? `${selectedItem.labelMr} (${selectedItem.labelEn})`
      : selectedItem.labelMr
    : value || '';

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleSelectCustom = () => {
    if (onCustomSelected) {
      onCustomSelected();
    }
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="relative" ref={containerRef}>
      {label && (
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          {label} {required && <span className="text-emerald-700">*</span>}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between pl-3 pr-3 py-2 text-left text-sm rounded-xl border transition-all duration-150 ${
          disabled
            ? 'bg-gray-100/70 border-gray-200 text-gray-400 cursor-not-allowed'
            : isOpen
            ? 'bg-white border-emerald-500 ring-2 ring-emerald-500/20 text-gray-900 shadow-xs'
            : 'bg-white border-gray-300 text-gray-900 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs'
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          {Icon && (
            <Icon
              className={`w-3.5 h-3.5 shrink-0 ${
                disabled ? 'text-gray-300' : 'text-emerald-700'
              }`}
            />
          )}
          <span className={`truncate ${!value && 'text-gray-400 font-normal'}`}>
            {disabled ? disabledMessage : displayLabel || placeholder}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 ml-2 shrink-0 transition-transform duration-200 ${
            disabled ? 'text-gray-300' : 'text-gray-500'
          } ${isOpen ? 'rotate-180 text-emerald-700' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div className="absolute z-50 mt-1 w-full bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-100">
          {/* Search Header */}
          <div className="p-2 border-b border-gray-100 bg-gray-50/70">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="शोधा (उदा. Solapur / सोलापूर)..."
                className="w-full pl-8 pr-7 py-1.5 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-gray-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 p-0.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-52 overflow-y-auto p-1 divide-y divide-gray-50 text-xs">
            {/* Custom option prompt if permitted */}
            {allowCustomOption && (
              <button
                type="button"
                onClick={handleSelectCustom}
                className="w-full text-left px-3 py-2 rounded-lg font-medium text-emerald-800 bg-emerald-50/60 hover:bg-emerald-100/80 transition-colors flex items-center justify-between mb-1 border border-emerald-200/50"
              >
                <span>✍️ {customOptionLabel}</span>
                <span className="text-[10px] bg-emerald-200/70 text-emerald-900 px-1.5 py-0.5 rounded">स्वतः टाईप करा</span>
              </button>
            )}

            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-emerald-50 text-emerald-900 font-semibold'
                        : 'text-gray-800 hover:bg-gray-100/80'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <span className="font-medium">{opt.labelMr}</span>
                      {opt.labelEn && (
                        <span className="ml-1.5 text-[11px] text-gray-500 font-normal">
                          ({opt.labelEn})
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="py-4 px-3 text-center text-gray-500 text-xs">
                <span>कोणतेही नाव सापडले नाही</span>
                {allowCustomOption && (
                  <button
                    type="button"
                    onClick={handleSelectCustom}
                    className="block mx-auto mt-2 text-emerald-700 font-medium hover:underline"
                  >
                    "{searchQuery}" स्वतः गाव नाव म्हणून जोडा
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
