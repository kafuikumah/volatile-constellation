'use client';

import { useEffect, useState } from 'react';
import { Monitor, Smartphone, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function MobileNotice() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <AnimatePresence>
            {isMobile && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-slate-900/95 backdrop-blur-md"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, type: "spring", damping: 25, stiffness: 300 }}
                        className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl text-center relative overflow-hidden"
                    >
                        {/* Background Decoration */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl" />
                        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />

                        <div className="relative z-10">
                            <div className="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Monitor className="w-10 h-10 text-orange-600" />
                            </div>

                            <h2 className="text-2xl font-bold text-slate-900 mb-4 font-heading">
                                Desktop Experience Recommended
                            </h2>

                            <p className="text-slate-600 mb-8 leading-relaxed">
                                The Afri Health platform is designed for large-scale data analysis and interactive mapping, which requires a desktop-class screen size for the best experience.
                            </p>

                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 text-left">
                                    <Smartphone className="w-5 h-5 text-slate-400 shrink-0" />
                                    <span className="text-xs text-slate-500 font-medium">Mobile support is currently limited for advanced analytics.</span>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100 text-left">
                                    <AlertTriangle className="w-5 h-5 text-blue-500 shrink-0" />
                                    <span className="text-xs text-blue-700 font-semibold uppercase tracking-wider">Please switch to a laptop or desktop computer.</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-100 italic text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                            afri health systems dashboard
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
