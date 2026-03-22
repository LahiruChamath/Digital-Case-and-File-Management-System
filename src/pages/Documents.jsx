import React, { useState, useEffect } from 'react';
import { Search, Upload, Filter, FileText, Calendar, MoreVertical, FolderOpen, HardDrive, Download, Trash2 } from 'lucide-react';
import { documentService } from '../services/documentService';
import { caseService } from '../services/caseService';
import { useToast } from '../context/ToastContext';

const Documents = () => {
  const { showToast } = useToast();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [documents, setDocuments] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({ title: '', caseId: '', file: null, format: 'Other' });
  const [uploading, setUploading] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('user'));

  const fetchData = async (query = '') => {
    setLoading(true);
    try {
      const [docsData, casesData] = await Promise.all([
        documentService.search(query),
        caseService.getAll()
      ]);
      setDocuments(docsData);
      setCases(casesData);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    fetchData(searchTerm);
  }, [searchTerm]);

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadForm.file || !uploadForm.caseId) return showToast('File and Case are required', 'error');
    
    setUploading(true);
    const formData = new FormData();
    formData.append('title', uploadForm.title);
    formData.append('caseId', uploadForm.caseId);
    formData.append('file', uploadForm.file);
    
    // Find client ID from selected case
    const selectedCase = cases.find(c => c._id === uploadForm.caseId);
    if (selectedCase?.client?._id) {
      formData.append('clientId', selectedCase.client._id);
    }

    try {
      await documentService.upload(formData);
      setIsUploadModalOpen(false);
      setUploadForm({ title: '', caseId: '', file: null, format: 'Other' });
      fetchData(searchTerm);
      showToast('Document uploaded successfully!', 'success');
    } catch (error) {
      showToast(error.response?.data?.message || 'Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = (url) => {
    window.open(url, '_blank');
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this document? This cannot be undone.")) {
      try {
        await documentService.delete(id);
        showToast('Document deleted successfully', 'success');
        fetchData(searchTerm);
      } catch (error) {
        showToast(error.response?.data?.message || 'Failed to delete document', 'error');
      }
    }
  };

  const filteredDocs = activeCategory === 'All' 
    ? documents 
    : documents.filter(d => activeCategory === 'PDFs' && d.format === 'pdf' 
      || activeCategory === 'Images' && ['jpeg', 'jpg', 'png'].includes(d.format)
      || activeCategory === 'Documents' && ['doc', 'docx'].includes(d.format)
    );

  const categories = [
    { name: 'All', count: documents.length },
    { name: 'PDFs', count: documents.filter(d => d.format === 'pdf').length },
    { name: 'Images', count: documents.filter(d => ['jpeg', 'jpg', 'png'].includes(d.format)).length },
    { name: 'Documents', count: documents.filter(d => ['doc', 'docx'].includes(d.format)).length },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-apple-text tracking-tight">Document Repository</h1>
          <p className="text-gray-500 mt-1.5 text-sm">Secure storage and retrieval for all firm documentation.</p>
        </div>
        {currentUser?.role === 'Senior Lawyer' && (
          <button className="btn-primary" onClick={() => setIsUploadModalOpen(true)}>
            <Upload className="w-4 h-4" />
            Upload Document
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar / Folders */}
        <div className="col-span-1 lg:col-span-3 space-y-6">
          <div className="card p-6">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-4 ml-2">Collections</h2>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                    activeCategory === cat.name
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-apple-text'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FolderOpen className={`w-4 h-4 ${activeCategory === cat.name ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-600'}`} />
                    <span>{cat.name}</span>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-md font-bold tracking-wider ${
                      activeCategory === cat.name
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Storage Usage Widget */}
          <div className="card p-6 border-t-4 border-t-primary-500 rounded-t-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 bg-gray-50 rounded-lg">
                <HardDrive className="w-4 h-4 text-gray-500" />
              </div>
              <h2 className="text-sm font-bold text-apple-text">Storage Usage</h2>
            </div>
            
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
              <div className="h-full bg-primary-500 rounded-full" style={{ width: '65%' }}></div>
            </div>
            <p className="text-[11px] font-semibold text-gray-400 tracking-wider flex justify-between uppercase">
              <span className="text-gray-600 text-xs">6.5 GB</span>
              <span>10 GB Total</span>
            </p>
          </div>
        </div>

        {/* Documents Main Area */}
        <div className="col-span-1 lg:col-span-9 card flex flex-col min-h-[600px] overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-96 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search documents by name or phrase..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="clean-input pl-11"
                />
              </div>
              <button className="btn-outline w-full sm:w-auto">
                <Filter className="w-4 h-4" />
                Sort & Filter
              </button>
            </div>
          </div>

          {/* Table */}
          {loading ? (
             <div className="flex justify-center items-center flex-1 p-20">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
             </div>
          ) : (
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="table-header py-4 px-6">Name</th>
                    <th className="table-header py-4 px-6">Related Case</th>
                    <th className="table-header py-4 px-6">Format</th>
                    <th className="table-header py-4 px-6">Date Modified</th>
                    <th className="table-header py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredDocs.map((doc) => (
                    <tr key={doc._id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-50 group-hover:bg-white border border-gray-100 rounded-lg shadow-sm transition-colors">
                            <FileText className="w-4 h-4 text-gray-500 group-hover:text-primary-500 transition-colors" />
                          </div>
                          <span className="text-sm font-semibold text-apple-text group-hover:text-primary-600 transition-colors">{doc.title}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-gray-500">{doc.case?.title || 'Unknown Default'}</td>
                      <td className="py-4 px-6">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md">{doc.format}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(doc.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDownload(doc.fileUrl); }} 
                            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Download Document"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          {currentUser?.role === 'Senior Lawyer' && (
                            <button 
                              onClick={(e) => handleDelete(e, doc._id)} 
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-1"
                              title="Delete Document"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredDocs.length === 0 && (
                    <tr>
                      <td colSpan="5" className="py-20 text-center text-sm font-medium text-gray-500">
                        No documents found in this collection.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-6 text-apple-text tracking-tight">Upload New Document</h2>
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Display Name</label>
                <input type="text" required className="clean-input" placeholder="e.g. Contract Agreement"
                  value={uploadForm.title} onChange={e => setUploadForm({...uploadForm, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Related Case</label>
                <select required className="clean-input" value={uploadForm.caseId} onChange={e => setUploadForm({...uploadForm, caseId: e.target.value})}>
                  <option value="" disabled>Select a case...</option>
                  {cases.map(c => <option key={c._id} value={c._id}>{c.title} ({c.caseNumber})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">File</label>
                <input type="file" required accept=".pdf,image/*,video/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 file:transition-colors cursor-pointer"
                  onChange={e => setUploadForm({...uploadForm, file: e.target.files[0]})} />
                <p className="text-[11px] text-gray-400 font-medium mt-2">
                  ℹ️ Only PDF, Image, and Video files are supported.
                </p>
              </div>
              <div className="flex justify-end gap-3 pt-6 mt-2 border-t border-gray-100">
                <button type="button" onClick={() => setIsUploadModalOpen(false)} className="px-5 py-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors">Cancel</button>
                <button type="submit" disabled={uploading} className="btn-primary">
                  {uploading ? 'Uploading...' : 'Upload File'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;