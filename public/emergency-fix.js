/**
 * 紧急修复脚本 - 恢复页面交互能力
 * 
 * 此脚本解决由StopPropagation组件或其他事件处理问题引起的页面无响应问题
 */

(function () {
    console.log('紧急修复脚本已加载');

    // 主要修复函数
    function applyEmergencyFix() {
        // 1. 确保基本HTML元素可交互
        document.documentElement.style.pointerEvents = 'auto';
        document.body.style.pointerEvents = 'auto';

        // 2. 移除任何可能的覆盖层
        const possibleOverlays = document.querySelectorAll('div[style*="position: fixed"], div[style*="position:fixed"]');
        possibleOverlays.forEach(function (overlay) {
            if (isLikelyBlockingOverlay(overlay)) {
                console.log('移除可能的阻塞覆盖层:', overlay);
                overlay.style.pointerEvents = 'none';
                // 保留元素但使其不阻碍交互，避免完全移除破坏功能
            }
        });

        // 3. 修复所有可能启用了stopPropagation的元素
        const allElements = document.querySelectorAll('*');
        allElements.forEach(function (el) {
            // 为所有元素添加点击事件直接传播
            const originalClick = el.onclick;
            el.onclick = function (e) {
                if (originalClick) {
                    originalClick.call(this, e);
                }
                // 确保事件传播
                return true;
            };
        });

        // 4. 如果没有找到紧急按钮，则添加
        if (!document.getElementById('emergency-fix-btn')) {
            addEmergencyButton();
        }
    }

    // 添加紧急按钮
    function addEmergencyButton() {
        const button = document.createElement('button');
        button.id = 'emergency-fix-btn';
        button.innerHTML = '恢复交互';
        button.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 9999; ' +
            'background: red; color: white; padding: 10px 15px; border: none; ' +
            'border-radius: 5px; cursor: pointer; font-weight: bold;';

        button.addEventListener('click', function (e) {
            e.stopPropagation = function () { }; // 覆盖stopPropagation
            applyEmergencyFix();
            alert('紧急修复已应用!');
        });

        document.body.appendChild(button);
    }

    // 判断元素是否可能是阻塞覆盖层
    function isLikelyBlockingOverlay(element) {
        const style = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();

        // 检查元素是否覆盖大部分屏幕
        const coversMostOfScreen =
            rect.width > window.innerWidth * 0.5 &&
            rect.height > window.innerHeight * 0.5;

        // 检查元素是否位于顶层位置
        const isTopLayer =
            style.position === 'fixed' &&
            parseInt(style.zIndex) > 100;

        return coversMostOfScreen && isTopLayer;
    }

    // 全局事件处理器，保持交互性
    function setupGlobalEventHandler() {
        document.addEventListener('click', function (e) {
            // 如果点击的不是应用内的a标签或button，检查交互性
            if (!e.target.closest('a') && !e.target.closest('button')) {
                // 检查是否需要再次应用修复
                const root = document.getElementById('root');
                if (root && window.getComputedStyle(root).pointerEvents === 'none') {
                    console.log('检测到交互问题，重新应用修复');
                    applyEmergencyFix();
                }
            }
        }, true); // 使用捕获阶段，确保在其他处理程序之前执行
    }

    // 设置定期检查，避免React更新后重新引入问题
    function setupPeriodicCheck() {
        setInterval(function () {
            const root = document.getElementById('root');
            if (root && window.getComputedStyle(root).pointerEvents === 'none') {
                console.log('周期性检查：检测到交互问题，应用修复');
                applyEmergencyFix();
            }
        }, 2000); // 每2秒检查一次
    }

    // 初始化
    function initialize() {
        // 立即应用修复
        applyEmergencyFix();

        // 设置全局事件处理程序
        setupGlobalEventHandler();

        // 设置周期性检查
        setupPeriodicCheck();

        // 在DOM加载完成后再次应用
        document.addEventListener('DOMContentLoaded', applyEmergencyFix);

        // 页面完全加载后再次应用
        window.addEventListener('load', applyEmergencyFix);
    }

    // 运行初始化
    initialize();

    // 向window暴露紧急修复函数，以便随时可以手动调用
    window.emergencyFix = applyEmergencyFix;

    console.log('紧急修复脚本初始化完成');
})(); 