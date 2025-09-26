import React, { useState } from 'react';
import { Search, Loader2, Hash, List, Plus, X } from 'lucide-react';

interface SearchFormProps {
  onSingleKeywordSearch: (keyword: string) => void;
  onMultiKeywordSearch: (keywords: string[]) => void;
  isLoading: boolean;
}

export default function SearchForm({ onSingleKeywordSearch, onMultiKeywordSearch, isLoading }: SearchFormProps) {
  const [searchInput, setSearchInput] = useState('');
  const [searchType, setSearchType] = useState<'single' | 'multi'>('single');
  const [keywords, setKeywords] = useState<string[]>(['']);

  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSingleKeywordSearch(searchInput.trim());
    }
  };

  const handleMultiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validKeywords = keywords.filter(k => k.trim()).map(k => k.trim());
    if (validKeywords.length > 0) {
      onMultiKeywordSearch(validKeywords);
    }
  };

  const addKeywordField = () => {
    if (keywords.length < 20) { // Limit to 20 keywords
      setKeywords([...keywords, '']);
    }
  };

  const removeKeywordField = (index: number) => {
    if (keywords.length > 1) {
      setKeywords(keywords.filter((_, i) => i !== index));
    }
  };

  const updateKeyword = (index: number, value: string) => {
    const newKeywords = [...keywords];
    newKeywords[index] = value;
    setKeywords(newKeywords);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Cek Visibilitas Konten di Platform AI
        </h2>
        <p className="text-gray-600">
          Periksa visibilitas konten dari profil Rizky Ega Pratama di kumparan.com dengan satu kata kunci atau beberapa kata kunci sekaligus
        </p>
      </div>

      {/* Search Type Toggle */}
      <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
        <button
          type="button"
          onClick={() => setSearchType('single')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium transition-all ${
            searchType === 'single'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Hash className="h-4 w-4" />
          Kata Kunci Tunggal
        </button>
        <button
          type="button"
          onClick={() => setSearchType('multi')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium transition-all ${
            searchType === 'multi'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <List className="h-4 w-4" />
          Multi Kata Kunci
        </button>
      </div>

      {searchType === 'single' ? (
        <form onSubmit={handleSingleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Masukkan kata kunci yang ingin dicek (contoh: cara agar anak kucing gemuk)..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              disabled={isLoading}
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          
          <button
            type="submit"
            disabled={!searchInput.trim() || isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Sedang Mengecek...
              </>
            ) : (
              <>
                <Search className="h-5 w-5" />
                Cek Visibilitas
              </>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleMultiSubmit} className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Kata Kunci (maksimal 20)
              </label>
              <span className="text-xs text-gray-500">
                {keywords.filter(k => k.trim()).length}/20
              </span>
            </div>
            
            {keywords.map((keyword, index) => (
              <div key={index} className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => updateKeyword(index, e.target.value)}
                    placeholder={`Kata kunci ${index + 1}...`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    disabled={isLoading}
                  />
                </div>
                {keywords.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeKeywordField(index)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            
            {keywords.length < 20 && (
              <button
                type="button"
                onClick={addKeywordField}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
                disabled={isLoading}
              >
                <Plus className="h-4 w-4" />
                Tambah Kata Kunci
              </button>
            )}
          </div>
          
          <button
            type="submit"
            disabled={keywords.filter(k => k.trim()).length === 0 || isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Sedang Menganalisis...
              </>
            ) : (
              <>
                <Search className="h-5 w-5" />
                Cek Semua Kata Kunci
              </>
            )}
          </button>
        </form>
      )}
      
      <div className="mt-6 text-sm text-gray-500 text-center">
        <p>
          Platform yang dicek: Google AI Overview, AI Mode, SearchGPT, ChatGPT, Perplexity, Gemini, Microsoft Copilot, Claude
        </p>
      </div>
    </div>
  );
}