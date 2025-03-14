import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    // 计算要显示的页码
    const getPageNumbers = () => {
        const pageNumbers = [];

        // 在移动设备上显示更少的页码
        const maxPagesVisible = window.innerWidth < 640 ? 3 : 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesVisible - 1);

        // 调整起始页，确保我们始终显示最大数量的页码
        if (endPage - startPage + 1 < maxPagesVisible) {
            startPage = Math.max(1, endPage - maxPagesVisible + 1);
        }

        // 添加页码
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return pageNumbers;
    };

    if (totalPages <= 1) {
        return null; // 如果只有一页，不显示分页
    }

    return (
        <div className="flex items-center justify-center my-6">
            <nav className="flex items-center space-x-1 sm:space-x-2" aria-label="Pagination">
                {/* 上一页按钮 */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`h-10 px-2 sm:px-4 flex items-center justify-center rounded text-sm font-medium transition-colors ${currentPage === 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    aria-label="Previous page"
                >
                    <i className="fas fa-chevron-left mr-1"></i>
                    <span className="hidden sm:inline">上一页</span>
                </button>

                {/* 页码 - 小屏幕上会隐藏一部分 */}
                <div className="flex items-center space-x-1">
                    {getPageNumbers().map(number => (
                        <button
                            key={number}
                            onClick={() => onPageChange(number)}
                            className={`h-10 w-10 flex items-center justify-center rounded text-sm font-medium transition-colors ${currentPage === number
                                ? 'bg-orange-500 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            aria-label={`Page ${number}`}
                            aria-current={currentPage === number ? 'page' : undefined}
                        >
                            {number}
                        </button>
                    ))}
                </div>

                {/* 下一页按钮 */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`h-10 px-2 sm:px-4 flex items-center justify-center rounded text-sm font-medium transition-colors ${currentPage === totalPages
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    aria-label="Next page"
                >
                    <span className="hidden sm:inline">下一页</span>
                    <i className="fas fa-chevron-right ml-1"></i>
                </button>
            </nav>
        </div>
    );
};

export default Pagination; 