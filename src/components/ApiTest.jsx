import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 开发工具组件，用于测试API和帮助验证邮箱
const ApiTest = () => {
    const [emailToken, setEmailToken] = useState('');
    const [username, setUsername] = useState('');
    const [verificationStatus, setVerificationStatus] = useState('');
    const [apiEndpoint, setApiEndpoint] = useState('/auth/verify-email');
    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // 读取后端日志，查找验证链接
    useEffect(() => {
        // 为演示目的，查找Docker日志中的验证链接
        const fetchVerificationLinks = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/dev/logs');
                if (response.ok) {
                    const { logs } = await response.json();
                    // 解析日志中的验证链接
                    const regex = /验证链接: http:\/\/localhost:3000\/verify-email\/([a-zA-Z0-9\-_.]+)/g;
                    const matches = [];
                    let match;
                    while ((match = regex.exec(logs)) !== null) {
                        matches.push(match[1]);
                    }

                    if (matches.length > 0) {
                        setEmailToken(matches[matches.length - 1]); // 获取最新的令牌
                    }
                }
            } catch (error) {
                console.error('Error fetching verification links:', error);
            } finally {
                setLoading(false);
            }
        };

        // 此函数在实际开发中可能需要后端支持或从控制台手动复制
        // fetchVerificationLinks();
    }, []);

    // 获取用户列表
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/auth/users`);

            if (response.ok) {
                const users = await response.json();
                setUserList(users);
            } else {
                setVerificationStatus('获取用户列表失败');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setVerificationStatus('获取用户列表失败: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // 验证邮箱
    const verifyEmail = async () => {
        if (!emailToken) {
            setVerificationStatus('请输入验证令牌');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}${apiEndpoint}/${emailToken}`);

            const data = await response.json();

            if (response.ok) {
                setVerificationStatus('验证成功: ' + data.message);
            } else {
                setVerificationStatus('验证失败: ' + (data.error || '未知错误'));
            }
        } catch (error) {
            console.error('Verification error:', error);
            setVerificationStatus('验证失败: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // 激活用户（开发工具）
    const activateUser = async (userId) => {
        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/auth/dev/activate-user/${userId}`, {
                method: 'POST'
            });

            const data = await response.json();

            if (response.ok) {
                setVerificationStatus(`用户 ${userId} 激活成功`);
                fetchUsers(); // 刷新用户列表
            } else {
                setVerificationStatus('激活失败: ' + (data.error || '未知错误'));
            }
        } catch (error) {
            console.error('Activation error:', error);
            setVerificationStatus('激活失败: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-8">API 测试工具</h1>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8 dark:bg-gray-800">
                <h2 className="text-xl font-semibold mb-4">邮箱验证测试</h2>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">验证端点</label>
                    <input
                        type="text"
                        value={apiEndpoint}
                        onChange={(e) => setApiEndpoint(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">验证令牌</label>
                    <input
                        type="text"
                        value={emailToken}
                        onChange={(e) => setEmailToken(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                        placeholder="输入或粘贴验证令牌"
                    />
                </div>

                <button
                    onClick={verifyEmail}
                    disabled={loading}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md mr-2"
                >
                    {loading ? '处理中...' : '验证邮箱'}
                </button>

                <button
                    onClick={fetchUsers}
                    disabled={loading}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                >
                    {loading ? '加载中...' : '刷新用户列表'}
                </button>

                {verificationStatus && (
                    <div className={`mt-4 p-3 rounded ${verificationStatus.includes('成功') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {verificationStatus}
                    </div>
                )}
            </div>

            {userList.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
                    <h2 className="text-xl font-semibold mb-4">用户列表</h2>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">用户名</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">邮箱</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">状态</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">操作</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                {userList.map((user) => (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {user.isActive ? '已激活' : '未激活'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {!user.isActive && (
                                                <button
                                                    onClick={() => activateUser(user.id)}
                                                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                >
                                                    激活
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div className="mt-8">
                <button
                    onClick={() => navigate('/')}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                >
                    返回首页
                </button>
            </div>
        </div>
    );
};

export default ApiTest; 