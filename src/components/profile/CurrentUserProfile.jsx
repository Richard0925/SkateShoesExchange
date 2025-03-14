import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const CurrentUserProfile = () => {
    const { currentUser, refreshUserProfile, updateProfile, loading } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        preferredFoot: '',
        shoeSize: '',
        location: '',
    });
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [updateError, setUpdateError] = useState('');

    // Debug logging
    useEffect(() => {
        console.log("CurrentUserProfile rendered");
        console.log("Current user:", currentUser);
        console.log("Loading:", loading);
    }, [currentUser, loading]);

    // 在组件挂载时刷新用户资料
    useEffect(() => {
        const loadProfile = async () => {
            try {
                console.log("CurrentUserProfile: Refreshing user profile on mount");
                await refreshUserProfile();
                console.log("CurrentUserProfile: Profile refreshed successfully");
            } catch (err) {
                console.error("CurrentUserProfile: Error refreshing profile:", err);
                setUpdateError("Failed to load the latest profile data");
            }
        };

        if (currentUser) {
            loadProfile();
        }
    }, [refreshUserProfile]);

    useEffect(() => {
        // Initialize form data when currentUser changes
        if (currentUser) {
            console.log("Setting form data from currentUser:", currentUser);
            setFormData({
                preferredFoot: currentUser.preferredFoot || '',
                shoeSize: currentUser.shoeSize || '',
                location: currentUser.location || '',
            });
        }
    }, [currentUser]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateError('');
        setUpdateSuccess(false);

        try {
            console.log("Submitting profile update:", formData);
            await updateProfile(formData);
            setUpdateSuccess(true);
            setIsEditing(false);

            // Hide success message after 3 seconds
            setTimeout(() => {
                setUpdateSuccess(false);
            }, 3000);
        } catch (error) {
            console.error("Profile update error:", error);
            setUpdateError(error.message || 'Failed to update profile');
        }
    };

    const handleCancelEdit = () => {
        // Reset form data to current user data
        if (currentUser) {
            setFormData({
                preferredFoot: currentUser.preferredFoot || '',
                shoeSize: currentUser.shoeSize || '',
                location: currentUser.location || '',
            });
        }
        setIsEditing(false);
        setUpdateError('');
    };

    const getPreferredFootLabel = (foot) => {
        switch (foot) {
            case 'regular': return 'Regular Stance';
            case 'goofy': return 'Goofy Stance';
            case 'both': return 'Both Stances';
            default: return 'Not Set';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-orange-500" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                <p>Please log in to view your profile.</p>
                <Link to="/" className="text-blue-500 underline mt-2">Return to Home</Link>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden dark:bg-gray-800 dark:text-white">
            {/* Profile Header */}
            <div className="relative h-48 bg-gradient-to-r from-gray-800 to-orange-500">
                {!isEditing && (
                    <button
                        className="absolute top-4 right-4 bg-white hover:bg-gray-100 text-gray-800 px-4 py-2 rounded-md text-sm font-medium transition-all"
                        onClick={() => setIsEditing(true)}
                    >
                        Edit Profile
                    </button>
                )}
            </div>

            <div className="relative px-6 py-4">
                <div className="absolute -top-16 left-6">
                    <div className="w-32 h-32 bg-gray-300 rounded-full border-4 border-white flex items-center justify-center text-4xl font-bold text-gray-600 dark:border-gray-700">
                        {currentUser.username?.charAt(0).toUpperCase() || '?'}
                    </div>
                </div>

                {/* Success Message */}
                {updateSuccess && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-2 mb-4">
                        <p>Profile updated successfully!</p>
                    </div>
                )}

                {/* Error Message */}
                {updateError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-2 mb-4">
                        <p>{updateError}</p>
                    </div>
                )}

                <div className="mt-20">
                    <h1 className="text-2xl font-bold">{currentUser.username}</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Joined {currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'Unknown date'}
                    </p>

                    {isEditing ? (
                        <form onSubmit={handleSubmit} className="mt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Preferred Foot
                                    </label>
                                    <select
                                        name="preferredFoot"
                                        value={formData.preferredFoot}
                                        onChange={handleInputChange}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600"
                                    >
                                        <option value="">Select Preference</option>
                                        <option value="regular">Regular Stance</option>
                                        <option value="goofy">Goofy Stance</option>
                                        <option value="both">Both Stances</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Shoe Size
                                    </label>
                                    <input
                                        type="text"
                                        name="shoeSize"
                                        value={formData.shoeSize}
                                        onChange={handleInputChange}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600"
                                        placeholder="Enter your shoe size"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600"
                                        placeholder="Enter your location"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    ) : (
                        <>
                            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-4 border rounded-lg dark:border-gray-600">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Preferred Foot</p>
                                    <p className="text-xl font-semibold">{getPreferredFootLabel(currentUser.preferredFoot)}</p>
                                </div>
                                <div className="p-4 border rounded-lg dark:border-gray-600">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Shoe Size</p>
                                    <p className="text-xl font-semibold">{currentUser.shoeSize || 'Not Set'}</p>
                                </div>
                                <div className="p-4 border rounded-lg dark:border-gray-600">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                                    <p className="text-xl font-semibold">{currentUser.location || 'Not Set'}</p>
                                </div>
                            </div>

                            <div className="mt-6">
                                <p className="text-gray-700 dark:text-gray-300">Email: {currentUser.email}</p>
                            </div>

                            {/* User Stats */}
                            <div className="mt-6 flex space-x-4 text-center border-t border-b py-3 dark:border-gray-600">
                                <div className="flex-1">
                                    <p className="text-2xl font-bold">0</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Listed Shoes</p>
                                </div>
                                <div className="flex-1">
                                    <p className="text-2xl font-bold">0</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Successful Trades</p>
                                </div>
                                <div className="flex-1">
                                    <p className="text-2xl font-bold">New User</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                                </div>
                            </div>

                            {/* Account Actions Section */}
                            <div className="mt-6 border-t pt-4 dark:border-gray-600">
                                <h3 className="text-lg font-medium mb-3">Account Actions</h3>
                                <div className="space-y-2">
                                    <Link to="/change-password" className="block text-blue-500 hover:text-blue-700">
                                        Change Password
                                    </Link>
                                    {!currentUser.isActive && (
                                        <Link to="/resend-verification" className="block text-blue-500 hover:text-blue-700">
                                            Resend Verification Email
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CurrentUserProfile; 