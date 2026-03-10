import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import searchService from '../../services/searchService';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => { if (searchRef.current && !searchRef.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length < 2) { setResults(null); setIsOpen(false); return; }
    const timer = setTimeout(async () => {
      try { setLoading(true); const data = await searchService.globalSearch(query); setResults(data); setIsOpen(true); }
      catch (error) { console.error('Search error:', error); }
      finally { setLoading(false); }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleResultClick = (type, id) => {
    setIsOpen(false); setQuery('');
    if (type === 'case') navigate(`/cases/${id}`);
    else if (type === 'client') navigate(`/clients/${id}`);
    else if (type === 'document') navigate(`/documents?highlight=${id}`);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search cases, clients, documents..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" />
        <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        {loading && <div className="absolute right-3 top-2.5"><div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div></div>}
      </div>
      {isOpen && results && (
        <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {results.cases?.length > 0 && (<div><div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">Cases</div>
            {results.cases.map((item) => (<button key={item._id} onClick={() => handleResultClick('case', item._id)} className="w-full text-left px-4 py-2 hover:bg-blue-50 flex items-center gap-2 text-sm">
              <span>📋</span><div><div className="font-medium">{item.caseNumber} - {item.title}</div><div className="text-xs text-gray-500">{item.status}</div></div></button>))}</div>)}
          {results.clients?.length > 0 && (<div><div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">Clients</div>
            {results.clients.map((item) => (<button key={item._id} onClick={() => handleResultClick('client', item._id)} className="w-full text-left px-4 py-2 hover:bg-blue-50 flex items-center gap-2 text-sm">
              <span>👤</span><div><div className="font-medium">{item.name}</div><div className="text-xs text-gray-500">{item.email}</div></div></button>))}</div>)}
          {results.documents?.length > 0 && (<div><div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">Documents</div>
            {results.documents.map((item) => (<button key={item._id} onClick={() => handleResultClick('document', item._id)} className="w-full text-left px-4 py-2 hover:bg-blue-50 flex items-center gap-2 text-sm">
              <span>📄</span><div><div className="font-medium">{item.title || item.filename}</div><div className="text-xs text-gray-500">{item.case?.caseNumber}</div></div></button>))}</div>)}
          {!results.cases?.length && !results.clients?.length && !results.documents?.length && (
            <div className="px-4 py-6 text-center text-gray-500 text-sm">No results found for "{query}"</div>)}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
