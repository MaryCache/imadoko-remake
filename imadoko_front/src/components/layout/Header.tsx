'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { MatchIcon, TeamIcon, UsageIcon } from '../ui/AnimatedIcons';
import clsx from 'clsx';

export const Header: React.FC = () => {
    const pathname = usePathname();

    const navItems = [
        { path: '/', label: '試合', icon: MatchIcon },
        { path: '/teams', label: 'チーム', icon: TeamIcon },
        { path: '/guide', label: '使い方', icon: UsageIcon },
    ];

    return (
        <header className="sticky top-0 z-50 bg-mikasa-blue-deep backdrop-blur-md border-b border-mikasa-blue shadow-md">
            <div className="container mx-auto px-4 max-w-7xl h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
                        <Image
                            src="/rogo_white.png"
                            alt="イマドコ・ローテ"
                            width={213}
                            height={40}
                            priority
                            className="h-10 w-auto"
                        />
                    </Link>
                </div>
                <nav className="flex items-center gap-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path;
                        const Icon = item.icon;
                        const [isHovered, setIsHovered] = useState(false);

                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                className={clsx(
                                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-mikasa-yellow text-mikasa-blue-deep shadow-sm ring-2 ring-mikasa-yellow-dark"
                                        : "text-white hover:bg-white/10 hover:text-mikasa-yellow"
                                )}
                            >
                                <Icon size={18} isHovered={isHovered} />
                                <span className="hidden md:block">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </header>
    );
};