import React from 'react';
import { CheckCircle, XCircle, AlertCircle, ExternalLink, Clock, Link } from 'lucide-react';

interface PlatformResult {
  name: string;
  status: 'visible' | 'not_visible' | 'partial' | 'checking';
  description: string;
  url?: string;
  lastChecked: string;
  references?: Array<{
    title: string;
    url: string;
    snippet: string;
  }>;
}

interface ResultsDisplayProps {
  keyword: string;
  results: PlatformResult[];
  isLoading: boolean;
}

export default function ResultsDisplay({ keyword, results, isLoading }: ResultsDisplayProps) {
  if (!keyword && !isLoading) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'visible':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'not_visible':
        return <XCircle className="h-6 w-6 text-red-500" />;
      case 'partial':
        return <AlertCircle className="h-6 w-6 text-yellow-500" />;
      case 'checking':
        return <Clock className="h-6 w-6 text-blue-500 animate-pulse" />;
      default:
        return <Clock className="h-6 w-6 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'visible':
        return 'border-green-200 bg-green-50';
      case 'not_visible':
        return 'border-red-200 bg-red-50';
      case 'partial':
        return 'border-yellow-200 bg-yellow-50';
      case 'checking':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'visible':
        return 'Terdeteksi';
      case 'not_visible':
        return 'Tidak Terdeteksi';
      case 'partial':
        return 'Sebagian Terdeteksi';
      case 'checking':
        return 'Sedang Dicek...';
      default:
        return 'Menunggu...';
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Hasil Pengecekan: "{keyword}"
          </h3>
          <p className="text-gray-600">
            Status visibilitas konten kumparan.com di berbagai platform AI dengan referensi web search
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {results.map((result, index) => (
            <div
              key={index}
              className={`p-6 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${getStatusColor(result.status)}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getStatusIcon(result.status)}
                  <div>
                    <h4 className="font-semibold text-gray-800">{result.name}</h4>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                      result.status === 'visible' ? 'bg-green-100 text-green-800' :
                      result.status === 'not_visible' ? 'bg-red-100 text-red-800' :
                      result.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {getStatusText(result.status)}
                    </span>
                  </div>
                </div>
                {result.url && (
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>

              <p className="text-sm text-gray-600 mb-4">{result.description}</p>

              {/* Reference Links */}
              {result.references && result.references.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                    <Link className="h-4 w-4" />
                    Referensi Web Search:
                  </h5>
                  <div className="space-y-2">
                    {result.references.map((ref, refIndex) => (
                      <div key={refIndex} className="bg-white/50 p-3 rounded border">
                        <a
                          href={ref.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm block mb-1"
                        >
                          {ref.title}
                        </a>
                        <p className="text-xs text-gray-600">{ref.snippet}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="text-xs text-gray-500">
                Terakhir dicek: {result.lastChecked}
              </div>
            </div>
          ))}
        </div>

        {!isLoading && results.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">Catatan Penting:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Hasil menggunakan web search mode untuk akurasi maksimal</li>
              <li>• Referensi link menunjukkan sumber konten yang ditemukan</li>
              <li>• Visibilitas dapat bervariasi berdasarkan lokasi dan preferensi pengguna</li>
              <li>• Data ini khusus untuk wilayah Indonesia</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}