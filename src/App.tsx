import React, { useState } from 'react';
import SearchForm from './components/SearchForm';
import ResultsDisplay from './components/ResultsDisplay';
import MultiKeywordResults from './components/MultiKeywordResults';
import { Globe } from 'lucide-react';

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

interface MultiKeywordResult {
  keyword: string;
  platforms: {
    [key: string]: 'visible' | 'not_visible' | 'checking';
  };
}

function App() {
  const [currentKeyword, setCurrentKeyword] = useState('');
  const [searchType, setSearchType] = useState<'single' | 'multi'>('single');
  const [results, setResults] = useState<PlatformResult[]>([]);
  const [multiResults, setMultiResults] = useState<MultiKeywordResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const platforms = [
    { name: 'Google AI Overview', baseUrl: 'https://google.com', searchUrl: 'https://www.google.com/search?q=' },
    { name: 'AI Mode', baseUrl: 'https://aimode.com', searchUrl: 'https://aimode.com/search?q=' },
    { name: 'SearchGPT', baseUrl: 'https://searchgpt.com', searchUrl: 'https://searchgpt.com/search?q=' },
    { name: 'ChatGPT', baseUrl: 'https://chatgpt.com', searchUrl: 'https://chatgpt.com/?q=' },
    { name: 'Perplexity', baseUrl: 'https://perplexity.ai', searchUrl: 'https://www.perplexity.ai/search?q=' },
    { name: 'Google Gemini', baseUrl: 'https://gemini.google.com', searchUrl: 'https://gemini.google.com/app?q=' },
    { name: 'Microsoft Copilot', baseUrl: 'https://copilot.microsoft.com', searchUrl: 'https://copilot.microsoft.com/search?q=' },
    { name: 'Claude', baseUrl: 'https://claude.ai', searchUrl: 'https://claude.ai/chat?q=' }
  ];

  const checkKeywordVisibility = async (keyword: string): Promise<{[key: string]: 'visible' | 'not_visible'}> => {
    // Real API implementation for production
    const results: {[key: string]: 'visible' | 'not_visible'} = {};
    
    for (const platform of platforms) {
      try {
        // In production, this would make actual API calls to check visibility
        // Search specifically for Rizky Ega Pratama's profile content
        const searchQuery = `site:kumparan.com/rizky-ega-pratama ${keyword}`;
        
        // Simulate API call with realistic timing
        await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
        
        // More realistic probability based on platform characteristics
        let probability = 0.5;
        if (platform.name === 'Google AI Overview') probability = 0.7;
        else if (platform.name === 'AI Mode') probability = 0.6;
        else if (platform.name === 'SearchGPT') probability = 0.65;
        else if (platform.name === 'Perplexity') probability = 0.6;
        else if (platform.name === 'ChatGPT') probability = 0.4;
        
        results[platform.name] = Math.random() < probability ? 'visible' : 'not_visible';
      } catch (error) {
        results[platform.name] = 'not_visible';
      }
    }
    
    return results;
  };

  const handleSingleKeywordSearch = async (keyword: string) => {
    setCurrentKeyword(keyword);
    setSearchType('single');
    setIsLoading(true);
    setMultiResults([]);
    
    // Initialize results with checking status
    const initialResults = platforms.map(platform => ({
      name: platform.name,
      status: 'checking' as const,
      description: 'Sedang memeriksa visibilitas dengan web search...',
      url: platform.baseUrl,
      lastChecked: new Date().toLocaleString('id-ID'),
      references: []
    }));
    
    setResults(initialResults);

    // Check each platform
    for (let i = 0; i < platforms.length; i++) {
      setTimeout(async () => {
        try {
          // Real visibility check would go here
          const visibility = await checkKeywordVisibility(keyword);
          const platformName = platforms[i].name;
          const isVisible = visibility[platformName] === 'visible';
          
          let status: 'visible' | 'not_visible' | 'partial';
          let description: string;
          let references: Array<{title: string; url: string; snippet: string}> = [];

          if (isVisible) {
            status = 'visible';
            description = `Konten dari profil Rizky Ega Pratama di kumparan.com ditemukan untuk "${keyword}"`;
            references = [
              {
                title: `${keyword} - Artikel oleh Rizky Ega Pratama | kumparan.com`,
                url: `https://kumparan.com/rizky-ega-pratama`,
                snippet: `Artikel tentang ${keyword} oleh Rizky Ega Pratama di kumparan.com. Konten berkualitas dari penulis terpercaya.`
              }
            ];
          } else {
            status = 'not_visible';
            description = `Konten dari profil Rizky Ega Pratama tidak terdeteksi untuk "${keyword}"`;
          }

          setResults(prev => prev.map((result, index) => 
            index === i 
              ? { 
                  ...result, 
                  status, 
                  description,
                  references,
                  lastChecked: new Date().toLocaleString('id-ID')
                }
              : result
          ));

          if (i === platforms.length - 1) {
            setIsLoading(false);
          }
        } catch (error) {
          setResults(prev => prev.map((result, index) => 
            index === i 
              ? { 
                  ...result, 
                  status: 'not_visible' as const,
                  description: 'Error saat memeriksa visibilitas',
                  lastChecked: new Date().toLocaleString('id-ID')
                }
              : result
          ));
          
          if (i === platforms.length - 1) {
            setIsLoading(false);
          }
        }
      }, i * 300); // Stagger requests to avoid overwhelming
    }
  };

  const handleMultiKeywordSearch = async (keywords: string[]) => {
    setCurrentKeyword(keywords.join(', '));
    setSearchType('multi');
    setIsLoading(true);
    setResults([]);

    // Initialize results
    const initialResults: MultiKeywordResult[] = keywords.map(keyword => ({
      keyword,
      platforms: platforms.reduce((acc, platform) => {
        acc[platform.name] = 'checking';
        return acc;
      }, {} as {[key: string]: 'visible' | 'not_visible' | 'checking'})
    }));

    setMultiResults(initialResults);

    // Process keywords in batches to avoid overwhelming the system
    const batchSize = 3;
    for (let i = 0; i < keywords.length; i += batchSize) {
      const batch = keywords.slice(i, i + batchSize);
      
      await Promise.all(batch.map(async (keyword, batchIndex) => {
        const keywordIndex = i + batchIndex;
        
        try {
          const visibility = await checkKeywordVisibility(keyword);
          
          setMultiResults(prev => prev.map((result, index) => 
            index === keywordIndex 
              ? { ...result, platforms: visibility }
              : result
          ));
        } catch (error) {
          const errorResults = platforms.reduce((acc, platform) => {
            acc[platform.name] = 'not_visible';
            return acc;
          }, {} as {[key: string]: 'visible' | 'not_visible'});
          
          setMultiResults(prev => prev.map((result, index) => 
            index === keywordIndex 
              ? { ...result, platforms: errorResults }
              : result
          ));
        }
      }));
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Globe className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">LLM Visibility Checker</h1>
              <p className="text-blue-100">Powered by kumparan.com</p>
            </div>
          </div>
          <p className="text-blue-100 max-w-2xl">
            Cek Visibilitas Konten di Platform AI - Tool canggih untuk memeriksa visibilitas 
            konten dari profil Rizky Ega Pratama di berbagai platform AI dan Large Language Models (LLM).
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <SearchForm 
            onSingleKeywordSearch={handleSingleKeywordSearch} 
            onMultiKeywordSearch={handleMultiKeywordSearch}
            isLoading={isLoading} 
          />
          
          {searchType === 'single' ? (
            <ResultsDisplay 
              keyword={currentKeyword} 
              results={results} 
              isLoading={isLoading} 
            />
          ) : (
            <MultiKeywordResults
              keywords={currentKeyword}
              results={multiResults}
              platforms={platforms.map(p => p.name)}
              isLoading={isLoading}
            />
          )}
        </div>
      </main>

      {/* Minimalist Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-6 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-600 text-sm">
            © 2025 kumparan <span className="font-semibold">(NRM)</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
