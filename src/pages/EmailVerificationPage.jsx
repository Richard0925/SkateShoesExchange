import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { verifyEmail } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

const EmailVerificationPage = () => {
    const { token } = useParams();
    const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
    const [message, setMessage] = useState('');
    const { login } = useAuth();

    useEffect(() => {
        const verify = async () => {
            if (!token) {
                setStatus('error');
                setMessage('无效的验证链接');
                return;
            }

            try {
                console.log('开始验证邮箱，token:', token);
                const response = await verifyEmail(token);
                console.log('验证邮箱响应:', response);

                if (response.success) {
                    setStatus('success');
                    setMessage(response.message || '邮箱验证成功！现在您可以登录了');
                } else {
                    setStatus('error');
                    setMessage(response.error || '验证失败，请稍后再试');
                }
            } catch (error) {
                console.error('验证邮箱出错:', error);
                setStatus('error');
                setMessage(error.message || '验证失败，请稍后再试');
            }
        };

        verify();
    }, [token]);

    return (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden md:max-w-2xl p-8 my-8">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">邮箱验证</h1>

                {status === 'verifying' && (
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mb-4"></div>
                        <p>正在验证您的邮箱，请稍候...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="text-center">
                        <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-4">
                            <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            <p>{message}</p>
                        </div>
                        <div className="mt-6">
                            <Link to="/login" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                                前往登录
                            </Link>
                        </div>
                    </div>
                )}

                {status === 'error' && (
                    <div className="text-center">
                        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
                            <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                            <p>{message}</p>
                        </div>
                        <div className="mt-6">
                            <Link to="/" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                                返回首页
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmailVerificationPage; 