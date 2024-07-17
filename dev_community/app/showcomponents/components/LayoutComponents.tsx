"use client"
import Footer from '@/app/home/components/Footer'
import Header from '@/app/home/components/Header'
import Taglist from '@/app/home/components/Taglist'
import React, { useEffect, useState } from 'react';
import CategoryCmp from './CategoryCmp'
import SideBar from './SideBar'

const LayoutComponents = ({ children }: any) => {
    const [tags, setTags] = useState<TagProps[]>([]);


    useEffect(() => {
        const fetchTags = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/home/outstanding/hash-tags/post`, {
                    headers: {
                        'Cache-Control': 'no-store',
                    },
                    cache: 'no-store',
                });
                if (!res.ok) {
                    throw new Error('Failed to fetch tags');
                }
                const data = await res.json();
                setTags(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchTags();
    }, []);

    return (
        <>
            <div>
                <Header />
                <Taglist tags={tags} />
                <div className='flex justify-between my-8 overflow-hidden'>
                    {/* <CategoryCmp /> */}
                    <SideBar />
                    {children}
                    <div className='max-w-[260px] lg:w-[260px] lg:block hidden'></div>
                </div>
                <div className='overflow-hidden'>
                    <Footer tags={tags} />
                </div>
            </div>
        </>
    )
}

export default LayoutComponents;
