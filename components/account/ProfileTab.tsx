'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';
import { User, Mail, MapPin, Phone, Camera, Save, Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function ProfileTab() {
    const { data, checkAuth } = useAuth();
    const user = data?.user;

    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Local form state
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                phone: user.phone || '',
                address: user.address || ''
            });
        }
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user?.id) return;

        try {
            setIsLoading(true);
            const response = await fetch(`${baseUrl}/api/users/profile/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    phone: formData.phone,
                    address: formData.address
                })
            });

            if (response.ok) {
                toast.success('Profil berhasil diperbarui');
                setIsEditing(false);
                await checkAuth(); // Refresh session
            } else {
                throw new Error('Failed to update');
            }
        } catch (error) {
            console.error('Update error:', error);
            toast.error('Gagal memperbarui profil');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !user?.id) return;

        // Validasi ukuran file (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error('Ukuran file maksimal 2MB');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        const uploadToast = toast.loading('Mengupload foto...');

        try {
            const response = await fetch(`${baseUrl}/api/users/avatar/${user.id}`, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                toast.success('Foto profil diperbarui', { id: uploadToast });
                await checkAuth(); // Refresh session
            } else {
                throw new Error('Upload failed');
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Gagal upload foto', { id: uploadToast });
        }
    };

    if (!user) return null;

    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
            {/* Header / Banner */}
            <div className="h-32 bg-gradient-to-r from-[#cb6112] to-[#ff8f4d] relative">
                <div className="absolute inset-0 bg-black/10" />
            </div>

            <div className="px-8 pb-8">
                {/* Photo Profile Section */}
                {/* Photo Profile Section */}
                <div className="relative -mt-16 mb-8 flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-0 md:justify-between">
                    <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                        <div className="relative group shrink-0">
                            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white dark:border-slate-900 shadow-lg overflow-hidden bg-slate-100">
                                {user.image ? (
                                    <Image
                                        src={user.image}
                                        alt={user.name}
                                        width={128}
                                        height={128}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                                        <User size={48} />
                                    </div>
                                )}
                            </div>

                            {/* Edit Photo Button */}
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-1 right-1 p-2 bg-white dark:bg-slate-800 rounded-full shadow-md text-gray-600 dark:text-gray-300 hover:text-[#cb6112] transition-colors border border-gray-100 dark:border-gray-700"
                            >
                                <Camera size={16} />
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>

                        <div className="text-center md:text-left mb-2 md:mb-0">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white line-clamp-1">{user.name}</h2>
                            <p className="text-gray-500 text-sm line-clamp-1">{user.email}</p>
                        </div>
                    </div>

                    {/* Edit Toggle Button */}
                    <div className="mt-4 md:mt-0 w-full md:w-auto">
                        {!isEditing ? (
                            <Button
                                onClick={() => setIsEditing(true)}
                                variant="outline"
                                className="w-full md:w-auto border-orange-200 text-[#cb6112] hover:bg-orange-50"
                            >
                                Edit Profil
                            </Button>
                        ) : (
                            <Button
                                onClick={() => setIsEditing(false)}
                                variant="ghost"
                                className="w-full md:w-auto text-gray-500"
                            >
                                Batal
                            </Button>
                        )}
                    </div>
                </div>

                {/* Form Section */}
                <form onSubmit={onSubmit} className="space-y-6 max-w-2xl">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <User size={16} /> Nama Lengkap
                            </label>
                            <Input
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                placeholder="Nama Lengkap"
                                className="bg-gray-50 dark:bg-slate-800/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <Mail size={16} /> Email
                            </label>
                            <Input
                                disabled
                                value={user.email}
                                className="bg-gray-100 dark:bg-slate-900 text-gray-500 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-400">Email tidak dapat diubah</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <Phone size={16} /> Nomor Telepon
                            </label>
                            <Input
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                placeholder="08..."
                                className="bg-gray-50 dark:bg-slate-800/50"
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <MapPin size={16} /> Alamat Pengiriman
                            </label>
                            <Input
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                placeholder="Alamat lengkap..."
                                className="bg-gray-50 dark:bg-slate-800/50"
                            />
                        </div>
                    </div>

                    {isEditing && (
                        <div className="flex justify-end pt-4">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="bg-[#cb6112] hover:bg-[#b0520e] text-white min-w-[140px]"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Simpan Perubahan
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
