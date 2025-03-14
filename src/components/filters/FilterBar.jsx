import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListingsContext } from '../../contexts/ListingsContext';

const FilterBar = ({ showResetButton = true }) => {
    const { searchParams, setSearchParams } = useContext(ListingsContext);
    const navigate = useNavigate();

    // State for tracking open dropdowns
    const [openDropdown, setOpenDropdown] = useState(null);

    // Filter states - 从searchParams初始化，但不会自动跟随searchParams变化
    const [selectedBrand, setSelectedBrand] = useState(searchParams.brand || '');
    const [selectedSize, setSelectedSize] = useState(searchParams.size || '');
    const [selectedCondition, setSelectedCondition] = useState(searchParams.condition || '');
    const [selectedLocation, setSelectedLocation] = useState(searchParams.location || '');
    const [selectedSort, setSelectedSort] = useState(searchParams.sortBy || 'newest');

    // Check if any filter is active
    const hasActiveFilters = selectedBrand || selectedSize || selectedCondition || selectedLocation || searchParams.query;

    // 跟踪是否正在应用过滤器，避免循环
    const [isApplyingFilters, setIsApplyingFilters] = useState(false);

    // 只在初始化和searchParams变化时同步状态，避免与用户选择冲突
    useEffect(() => {
        // 如果正在应用过滤器，跳过此次同步
        if (isApplyingFilters) return;

        const newBrand = searchParams.brand || '';
        const newSize = searchParams.size || '';
        const newCondition = searchParams.condition || '';
        const newLocation = searchParams.location || '';
        const newSort = searchParams.sortBy || 'newest';

        setSelectedBrand(newBrand);
        setSelectedSize(newSize);
        setSelectedCondition(newCondition);
        setSelectedLocation(newLocation);
        setSelectedSort(newSort);
    }, [searchParams, isApplyingFilters]);

    // Refs for dropdown containers
    const dropdownRefs = {
        brand: useRef(null),
        size: useRef(null),
        condition: useRef(null),
        location: useRef(null),
        sort: useRef(null)
    };

    // Sample data for dropdowns
    const brands = ['Nike SB', 'Adidas', 'Vans', 'DC', 'Etnies', 'És', 'New Balance', 'Converse', 'Emerica', 'Lakai'];
    const sizes = ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'];
    const conditions = ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1'];
    const locations = ['London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow', 'Edinburgh', 'Liverpool', 'Bristol'];
    const sortOptions = [
        { value: 'newest', label: 'Newest First' },
        { value: 'oldest', label: 'Oldest First' },
        { value: 'a-z', label: 'A-Z' },
        { value: 'z-a', label: 'Z-A' }
    ];

    // Handle clicks outside to close dropdowns
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (openDropdown &&
                dropdownRefs[openDropdown]?.current &&
                !dropdownRefs[openDropdown].current.contains(event.target)) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openDropdown]);

    // Toggle dropdown visibility
    const toggleDropdown = (dropdown) => {
        setOpenDropdown(openDropdown === dropdown ? null : dropdown);
    };

    // Handle filter selection
    const handleBrandSelect = (brand) => {
        setSelectedBrand(brand);
        setOpenDropdown(null);
        // 自动应用过滤器，提升用户体验
        handleAutoApply(brand, selectedSize, selectedCondition, selectedLocation, selectedSort);
    };

    const handleSizeSelect = (size) => {
        setSelectedSize(size);
        setOpenDropdown(null);
        // 自动应用过滤器
        handleAutoApply(selectedBrand, size, selectedCondition, selectedLocation, selectedSort);
    };

    const handleConditionSelect = (condition) => {
        setSelectedCondition(condition);
        setOpenDropdown(null);
        // 自动应用过滤器
        handleAutoApply(selectedBrand, selectedSize, condition, selectedLocation, selectedSort);
    };

    const handleLocationSelect = (location) => {
        setSelectedLocation(location);
        setOpenDropdown(null);
        // 自动应用过滤器
        handleAutoApply(selectedBrand, selectedSize, selectedCondition, location, selectedSort);
    };

    const handleSortSelect = (sort) => {
        setSelectedSort(sort);
        setOpenDropdown(null);
        // 自动应用过滤器
        handleAutoApply(selectedBrand, selectedSize, selectedCondition, selectedLocation, sort);
    };

    // 自动应用过滤器，提升用户体验
    const handleAutoApply = (brand, size, condition, location, sort) => {
        const newParams = { ...searchParams };

        // 更新或删除参数
        if (brand) newParams.brand = brand;
        else delete newParams.brand;

        if (size) newParams.size = size;
        else delete newParams.size;

        if (condition) newParams.condition = condition;
        else delete newParams.condition;

        if (location) newParams.location = location;
        else delete newParams.location;

        if (sort && sort !== 'newest') newParams.sortBy = sort;
        else delete newParams.sortBy;

        applyParams(newParams);
    };

    // 应用参数到搜索上下文
    const applyParams = (params) => {
        setIsApplyingFilters(true);
        setSearchParams(params);

        // 设置一个短暂的延时，确保状态更新完成
        setTimeout(() => {
            setIsApplyingFilters(false);
        }, 100);
    };

    // Reset all filters
    const resetFilters = () => {
        try {
            // Clear local filter states
            setSelectedBrand('');
            setSelectedSize('');
            setSelectedCondition('');
            setSelectedLocation('');
            setSelectedSort('newest');

            // 保留搜索查询，但清除其他过滤器
            const newParams = {};
            if (searchParams.query) {
                newParams.query = searchParams.query;
            }

            applyParams(newParams);

            // 使用 React Router 的 navigate 确保 URL 是干净的
            navigate('/', { replace: true });
        } catch (error) {
            console.error("Error resetting filters:", error);
        }
    };

    // 标准化的下拉菜单宽度
    const dropdownWidth = "w-full";

    // Render a dropdown filter
    const renderDropdown = (name, label, options, selectedValue, handleSelect, isLabelOnly = false) => {
        const isActive = selectedValue !== '';

        return (
            <div className="relative filter-option" ref={dropdownRefs[name]}>
                <button
                    type="button"
                    className={`px-4 py-2 rounded flex items-center text-sm ${dropdownWidth} h-12 justify-between
                        ${isActive
                            ? 'bg-orange-50 border border-orange-200 font-medium text-orange-700'
                            : 'bg-white border border-gray-200'
                        } hover:bg-gray-50 transition-colors`}
                    onClick={() => toggleDropdown(name)}
                >
                    <span className={`mr-1 ${isActive ? 'text-orange-700' : 'text-gray-700'}`}>{label}:</span>
                    {selectedValue ? (
                        <span className="font-medium">{isLabelOnly ? selectedValue : `${selectedValue}`}</span>
                    ) : (
                        <span className="text-gray-500">Any</span>
                    )}
                    <i className={`fas fa-chevron-${openDropdown === name ? 'up' : 'down'} ml-2 text-xs ${isActive ? 'text-orange-500' : ''}`}></i>
                </button>

                {openDropdown === name && (
                    <div className={`absolute top-full left-0 mt-1 ${dropdownWidth} bg-white rounded-md shadow-lg z-20 max-h-60 overflow-y-auto border border-gray-200`}>
                        <div className="p-2">
                            <div
                                className="px-3 py-1 hover:bg-gray-100 cursor-pointer rounded"
                                onClick={() => handleSelect('')}
                            >
                                Any
                            </div>
                            {options.map((option, index) => (
                                <div
                                    key={index}
                                    className={`px-3 py-1 hover:bg-gray-100 cursor-pointer rounded ${selectedValue === (typeof option === 'object' ? option.value : option)
                                        ? 'bg-orange-50 text-orange-700 font-medium'
                                        : ''
                                        }`}
                                    onClick={() => handleSelect(typeof option === 'object' ? option.value : option)}
                                >
                                    {typeof option === 'object' ? option.label : option}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // 添加事件监听器以响应外部重置事件
    useEffect(() => {
        const handleExternalReset = () => {
            resetFilters();
        };

        window.addEventListener('reset-filters', handleExternalReset);

        return () => {
            window.removeEventListener('reset-filters', handleExternalReset);
        };
    }, []);

    return (
        <div className="pt-3">
            <div className="filter-bar">
                <div className="flex flex-wrap items-center gap-2">
                    {/* Reset button positioned near the search input */}
                    {showResetButton && (
                        <div className="filter-option">
                            <button
                                onClick={resetFilters}
                                className={`px-4 py-2 rounded text-sm h-12 flex items-center justify-center w-full
                                ${hasActiveFilters ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500'} 
                                hover:${hasActiveFilters ? 'bg-orange-600' : 'bg-gray-200'} transition-colors`}
                                disabled={!hasActiveFilters}
                            >
                                <i className="fas fa-undo mr-2"></i>
                                Reset
                            </button>
                        </div>
                    )}

                    {renderDropdown('brand', 'Brand', brands, selectedBrand, handleBrandSelect)}
                    {renderDropdown('size', 'Size', sizes, selectedSize, handleSizeSelect)}
                    {renderDropdown('condition', 'Condition', conditions, selectedCondition, handleConditionSelect)}
                    {renderDropdown('location', 'Location', locations, selectedLocation, handleLocationSelect)}
                    {renderDropdown('sort', 'Sort By', sortOptions, selectedSort, handleSortSelect, true)}
                </div>

                {/* Active filters display */}
                {hasActiveFilters && (
                    <div className="mt-3 text-sm text-gray-600">
                        <span className="font-medium mr-2">Active filters:</span>
                        {selectedBrand && (
                            <span className="inline-flex items-center mr-2 px-2 py-1 bg-orange-50 text-orange-700 rounded border border-orange-200">
                                {selectedBrand}
                                <button onClick={() => handleBrandSelect('')} className="ml-1 text-orange-500 hover:text-orange-700">
                                    <i className="fas fa-times"></i>
                                </button>
                            </span>
                        )}
                        {selectedSize && (
                            <span className="inline-flex items-center mr-2 px-2 py-1 bg-orange-50 text-orange-700 rounded border border-orange-200">
                                Size {selectedSize}
                                <button onClick={() => handleSizeSelect('')} className="ml-1 text-orange-500 hover:text-orange-700">
                                    <i className="fas fa-times"></i>
                                </button>
                            </span>
                        )}
                        {selectedCondition && (
                            <span className="inline-flex items-center mr-2 px-2 py-1 bg-orange-50 text-orange-700 rounded border border-orange-200">
                                Condition {selectedCondition}/10
                                <button onClick={() => handleConditionSelect('')} className="ml-1 text-orange-500 hover:text-orange-700">
                                    <i className="fas fa-times"></i>
                                </button>
                            </span>
                        )}
                        {selectedLocation && (
                            <span className="inline-flex items-center mr-2 px-2 py-1 bg-orange-50 text-orange-700 rounded border border-orange-200">
                                {selectedLocation}
                                <button onClick={() => handleLocationSelect('')} className="ml-1 text-orange-500 hover:text-orange-700">
                                    <i className="fas fa-times"></i>
                                </button>
                            </span>
                        )}
                        {selectedSort !== 'newest' && (
                            <span className="inline-flex items-center mr-2 px-2 py-1 bg-orange-50 text-orange-700 rounded border border-orange-200">
                                {sortOptions.find(opt => opt.value === selectedSort)?.label || selectedSort}
                                <button onClick={() => handleSortSelect('newest')} className="ml-1 text-orange-500 hover:text-orange-700">
                                    <i className="fas fa-times"></i>
                                </button>
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FilterBar; 