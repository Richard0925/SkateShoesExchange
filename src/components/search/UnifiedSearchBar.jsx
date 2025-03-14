import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListingsContext } from '../../contexts/ListingsContext';

const UnifiedSearchBar = () => {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const { searchParams, setSearchParams } = useContext(ListingsContext);
    const navigate = useNavigate();
    const inputRef = useRef(null);
    const [isUpdatingSearch, setIsUpdatingSearch] = useState(false);

    // Initialize query from existing search params
    useEffect(() => {
        if (isUpdatingSearch) return;

        if (searchParams.query) {
            setQuery(searchParams.query);
        } else {
            setQuery('');
        }
    }, [searchParams.query, isUpdatingSearch]);

    const handleSubmit = (e) => {
        e.preventDefault();

        try {
            setIsUpdatingSearch(true);

            // 保存当前过滤器设置
            const newParams = { ...searchParams };

            if (query.trim()) {
                newParams.query = query.trim();
            } else {
                // 如果查询为空，删除查询参数
                delete newParams.query;
            }

            // 应用新的搜索参数
            setSearchParams(newParams);

            // 短暂延时后恢复状态
            setTimeout(() => {
                setIsUpdatingSearch(false);
            }, 100);
        } catch (error) {
            console.error("Error applying search:", error);
            setIsUpdatingSearch(false);
        }
    };

    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    const handleClearSearch = () => {
        try {
            setQuery('');
            setIsUpdatingSearch(true);

            // 保留其他过滤器，仅删除查询
            const newParams = { ...searchParams };
            delete newParams.query;

            setSearchParams(newParams);

            setTimeout(() => {
                setIsUpdatingSearch(false);
            }, 100);

            inputRef.current.focus();
        } catch (error) {
            console.error("Error clearing search:", error);
            setIsUpdatingSearch(false);
        }
    };

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className="flex items-center flex-wrap gap-2">
                <div className="relative flex-grow h-12">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <i className={`fas fa-search ${query ? 'text-orange-500' : 'text-gray-400'}`}></i>
                    </div>

                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={handleInputChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="Search by brand, model or size..."
                        className={`w-full h-full py-2 pl-12 pr-12 text-gray-900 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${isFocused ? 'ring-2 ring-orange-500' : query ? 'ring-1 ring-orange-200' : ''
                            }`}
                        aria-label="Search for shoes"
                        data-testid="search-input"
                    />

                    {query && (
                        <button
                            type="button"
                            onClick={handleClearSearch}
                            className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600"
                            aria-label="Clear search"
                        >
                            <i className="fas fa-times-circle"></i>
                        </button>
                    )}
                </div>

                <button
                    type="submit"
                    className="h-12 px-6 font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-md text-sm transition-colors flex items-center justify-center"
                    aria-label="Submit search"
                >
                    <i className="fas fa-search mr-2"></i>
                    Search
                </button>
            </form>
        </div>
    );
};

export default UnifiedSearchBar; 