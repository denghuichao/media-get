import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Video, Music, Image, Search, Filter, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { sites, getSiteSlug } from '../data/sites';

const getTypeIcon = (type: string) => {
    switch (type) {
        case 'Video': return <Video className="h-3 w-3" />;
        case 'Audio': return <Music className="h-3 w-3" />;
        case 'Image': return <Image className="h-3 w-3" />;
        default: return <Video className="h-3 w-3" />;
    }
};

export default function AllSupportedSites() {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState<string>('All');
    const [selectedRegion, setSelectedRegion] = useState<string>('All');

    // Get unique regions and types
    const regions = useMemo(() => {
        const uniqueRegions = Array.from(new Set(sites.map(site => site.region))).sort();
        return ['All', ...uniqueRegions];
    }, []);

    const types = useMemo(() => {
        const uniqueTypes = Array.from(new Set(sites.flatMap(site => site.types))).sort();
        return ['All', ...uniqueTypes];
    }, []);

    // Filter sites based on search and filters
    const filteredSites = useMemo(() => {
        return sites.filter(site => {
            const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                site.url.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = selectedType === 'All' || site.types.includes(selectedType);
            const matchesRegion = selectedRegion === 'All' || site.region === selectedRegion;

            return matchesSearch && matchesType && matchesRegion;
        });
    }, [searchTerm, selectedType, selectedRegion]);

    // Group sites by region
    const sitesByRegion = useMemo(() => {
        const grouped = filteredSites.reduce((acc, site) => {
            if (!acc[site.region]) {
                acc[site.region] = [];
            }
            acc[site.region].push(site);
            return acc;
        }, {} as Record<string, typeof sites>);

        // Sort regions with International first
        const sortedRegions = Object.keys(grouped).sort((a, b) => {
            if (a === 'International') return -1;
            if (b === 'International') return 1;
            return a.localeCompare(b);
        });

        return sortedRegions.map(region => ({
            region,
            sites: grouped[region]
        }));
    }, [filteredSites]);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        {t('allSupportedSites.title')}
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                        {t('allSupportedSites.subtitle')}
                    </p>

                    {/* Stats */}
                    <div className="flex justify-center space-x-8 text-sm text-gray-600 mb-8">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span>{sites.filter(s => s.types.includes('Video')).length} {t('supportedSites.types.video')}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span>{sites.filter(s => s.types.includes('Audio')).length} {t('supportedSites.types.audio')}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                            <span>{sites.filter(s => s.types.includes('Image')).length} {t('supportedSites.types.image')}</span>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder={t('allSupportedSites.searchPlaceholder')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        {/* Type Filter */}
                        <div className="flex items-center space-x-2">
                            <Filter className="h-4 w-4 text-gray-400" />
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                {types.map(type => (
                                    <option key={type} value={type}>
                                        {type === 'All' ? t('allSupportedSites.filters.allTypes') : type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Region Filter */}
                        <div className="flex items-center space-x-2">
                            <select
                                value={selectedRegion}
                                onChange={(e) => setSelectedRegion(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                {regions.map(region => (
                                    <option key={region} value={region}>
                                        {region === 'All' ? t('allSupportedSites.filters.allRegions') : region}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Results count */}
                    <div className="mt-4 text-sm text-gray-600">
                        {t('allSupportedSites.resultsCount', { count: filteredSites.length, total: sites.length })}
                    </div>
                </div>

                {/* Sites grouped by region */}
                {sitesByRegion.map(({ region, sites: regionSites }) => (
                    <div key={region} className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <span className="w-1 h-8 bg-blue-500 rounded-full mr-4"></span>
                            {region}
                            <span className="ml-2 text-lg text-gray-500 font-normal">
                                ({regionSites.length} {t('allSupportedSites.sitesCount')})
                            </span>
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {regionSites.map((site) => (
                                <a
                                    key={site.name}
                                    href={`/download/${getSiteSlug(site.name)}`}
                                    className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 group cursor-pointer border border-gray-100 hover:border-gray-200 block"
                                    aria-label={`Download from ${site.name} - ${site.url}`}
                                >
                                    <div className="flex items-start space-x-3 mb-3">
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                                            {site.favicon ? (
                                                <img
                                                    src={site.favicon}
                                                    alt={`${site.name} favicon`}
                                                    className="w-6 h-6 object-contain"
                                                    onError={(e) => {
                                                        // Fallback to letter if favicon fails to load
                                                        const target = e.target as HTMLImageElement;
                                                        target.style.display = 'none';
                                                        const parent = target.parentElement;
                                                        if (parent) {
                                                            parent.className = `w-8 h-8 ${site.color} rounded-lg flex items-center justify-center flex-shrink-0`;
                                                            parent.innerHTML = `<span class="text-white font-bold text-sm">${site.name.charAt(0)}</span>`;
                                                        }
                                                    }}
                                                />
                                            ) : (
                                                <div className={`w-8 h-8 ${site.color} rounded-lg flex items-center justify-center`}>
                                                    <span className="text-white font-bold text-sm">
                                                        {site.name.charAt(0)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-gray-900 text-sm truncate group-hover:text-blue-600 transition-colors">{site.name}</h3>
                                            <p className="text-xs text-gray-500 truncate group-hover:text-blue-500 transition-colors">{site.url}</p>
                                        </div>
                                        <div className="h-3 w-3 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0">
                                            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-1">
                                        {site.types.map((type) => (
                                            <span
                                                key={type}
                                                className="inline-flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors"
                                            >
                                                {getTypeIcon(type)}
                                                <span>{type}</span>
                                            </span>
                                        ))}
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                ))}

                {/* No results */}
                {filteredSites.length === 0 && (
                    <div className="text-center py-12">
                        <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {t('allSupportedSites.noResults.title')}
                        </h3>
                        <p className="text-gray-600 mb-4">
                            {t('allSupportedSites.noResults.description')}
                        </p>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedType('All');
                                setSelectedRegion('All');
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            {t('allSupportedSites.noResults.clearFilters')}
                        </button>
                    </div>
                )}

                {/* Back to home */}
                <div className="text-center mt-12">
                    <Link
                        to="/#supported"
                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        {t('allSupportedSites.backToHome')}
                    </Link>
                </div>
            </div>
        </div>
    );
}
