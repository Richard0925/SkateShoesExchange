import React, { useEffect } from 'react';

/**
 * 修复版StopPropagation组件
 * 原来的实现可能导致页面无法交互，这个版本解决了这个问题
 * 现在它会保证事件能够正常传播，而不是阻止它们
 */
const StopPropagation = () => {
    useEffect(() => {
        console.log('安全版StopPropagation组件已加载');

        // 确保页面可交互
        const ensureInteractivity = () => {
            // 恢复所有元素的交互能力
            document.body.style.pointerEvents = 'auto';
            document.documentElement.style.pointerEvents = 'auto';

            // 查找并移除可能的覆盖层
            const overlays = document.querySelectorAll('div[style*="position: fixed"][style*="top: 0"][style*="left: 0"][style*="width: 100%"][style*="height: 100%"]');
            overlays.forEach(overlay => {
                // 不移除元素，只是使其允许点击穿透
                console.log('调整覆盖层，允许交互:', overlay);
                overlay.style.pointerEvents = 'none';
            });
        };

        // 修复事件监听器
        const setupSafeEventHandlers = () => {
            // 移除可能阻止事件传播的事件监听器
            const eventTypes = ['click', 'touchstart', 'touchend', 'mousedown', 'mouseup'];

            eventTypes.forEach(eventType => {
                // 寻找并修复现有的事件处理程序
                const elements = document.querySelectorAll('*');
                elements.forEach(el => {
                    // 避免修改原生事件，只为页面添加额外的保险措施
                    const originalHandler = el[`on${eventType}`];
                    if (originalHandler) {
                        el[`on${eventType}`] = function (e) {
                            // 调用原始处理程序
                            originalHandler.call(this, e);
                            // 确保事件继续传播
                            return true;
                        };
                    }
                });
            });
        };

        // 实施修复
        ensureInteractivity();
        setupSafeEventHandlers();

        // 周期性检查
        const interval = setInterval(() => {
            ensureInteractivity();
        }, 1000);

        // 设置安全的全局错误处理
        window.onerror = function (message, source, lineno, colno, error) {
            console.error('捕获到页面错误:', message, source, lineno, colno, error);
            ensureInteractivity(); // 错误发生时尝试恢复交互
            return false; // 允许错误正常处理
        };

        // 清理函数
        return () => {
            clearInterval(interval);
        };
    }, []);

    return null; // 这个组件不渲染任何内容
};

export default StopPropagation; 