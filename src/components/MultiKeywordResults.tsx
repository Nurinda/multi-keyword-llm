import React from 'react';
import { Check, X, Clock, Download, BarChart3 } from 'lucide-react';

interface MultiKeywordResult {
  keyword: string;
  platforms: {
    [key: string]: 'visible' | 'not_visible' | 'checking';
  };
}

interface MultiKeywordResultsProps {
  keywords: string;
  results: MultiKeywordResult[];
  platforms: string[];
  isLoading: boolean;
}

export default function MultiKeywordResults({ keywords, results, platforms, isLoading }: MultiKeywordResultsProps) {
  if (!keywords && !isLoading) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'visible':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'not_visible':
        return <X className="h-4 w-4 text-red-600" />;
      case 'checking':
        return <Clock className="h-4 w-4 text-blue-500 animate-pulse" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const exportToCSV = () => {
    const headers = ['Kata Kunci', ...platforms];
    const rows = results.map(result => [
      result.keyword,
      ...platforms.map(platform => 
        result.platforms[platform] === 'visible' ? 'Ya' : 
        result.platforms[platform] === 'not_visible' ? 'Tidak' : 'Checking'
      )
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `llm-visibility-results-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStats = () => {
    if (results.length === 0) return { totalChecked: 0, totalVisible: 0, averageVisibility: 0 };
    
    const totalChecked = results.length * platforms.length;
    const totalVisible = results.reduce((acc, result) => {
      return acc + platforms.filter(platform => result.platforms[platform] === 'visible').length;
    }, 0);
    
    return {
      totalChecked,
      totalVisible,
      averageVisibility: totalChecked > 0 ? Math.round((totalVisible / totalChecked) * 100) : 0
    };
  };

  const stats = getStats();

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto mt-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Menganalisis Multi Kata Kunci
            </h3>
            <p className="text-gray-600">
              Sedang memeriksa visibilitas semua kata kunci di platform AI...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 space-y-6">
      {/* Stats Overview */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-800">Hasil Multi Kata Kunci</h3>
          </div>
          {results.length > 0 && (
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-600 font-medium">Total Kata Kunci</p>
            <p className="text-2xl font-bold text-blue-800">{results.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-sm text-green-600 font-medium">Total Terdeteksi</p>
            <p className="text-2xl font-bold text-green-800">{stats.totalVisible}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <p className="text-sm text-purple-600 font-medium">Rata-rata Visibilitas</p>
            <p className="text-2xl font-bold text-purple-800">{stats.averageVisibility}%</p>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800 min-w-[200px]">
                  Kata Kunci
                </th>
                {platforms.map((platform) => (
                  <th key={platform} className="px-4 py-4 text-center text-sm font-semibold text-gray-800 min-w-[120px]">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs">{platform.replace(' ', '\n')}</span>
                    </div>
                  </th>
                ))}
                <th className="px-4 py-4 text-center text-sm font-semibold text-gray-800 min-w-[80px]">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {results.map((result, index) => {
                const visibleCount = platforms.filter(platform => result.platforms[platform] === 'visible').length;
                
                return (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {result.keyword}
                    </td>
                    {platforms.map((platform) => (
                      <td key={platform} className="px-4 py-4 text-center">
                        <div className="flex justify-center">
                          {getStatusIcon(result.platforms[platform])}
                        </div>
                      </td>
                    ))}
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        visibleCount > platforms.length / 2 
                          ? 'bg-green-100 text-green-800' 
                          : visibleCount > 0 
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {visibleCount}/{platforms.length}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
        <h4 className="font-semibold text-blue-800 mb-3">Keterangan:</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-600" />
            <span className="text-blue-700">Terdeteksi - Konten Rizky Ega Pratama muncul</span>
          </div>
          <div className="flex items-center gap-2">
            <X className="h-4 w-4 text-red-600" />
            <span className="text-blue-700">Tidak Terdeteksi - Konten tidak muncul</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-500" />
            <span className="text-blue-700">Sedang Dicek - Proses pengecekan</span>
          </div>
        </div>
        <div className="mt-4 text-xs text-blue-600">
          <p>• Hasil berdasarkan web search mode untuk akurasi maksimal</p>
          <p>• Pencarian khusus untuk profil Rizky Ega Pratama di kumparan.com</p>
          <p>• Konten dari akun kumparan lain tidak dihitung dalam hasil</p>
          <p>• Data diperbarui secara real-time</p>
          <p>• Export CSV tersedia untuk analisis lebih lanjut</p>
        </div>
      </div>
    </div>
  );
}