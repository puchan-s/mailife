import React from 'react';
import Link from 'next/link';

class Index extends React.Component{
    render() {
        return (
            <div>
                <p>Hello Next.js</p>
                <Link href='/'>
                    Home
                </Link>
                <Link href='/ '>
                    About
                </Link>
                <Link href='/portfolios'>
                    Portfolio
                </Link>
                <Link href='/blogs'>
                    Blog
                </Link>
                <Link href='/cv'>
                    CV
                </Link>
            </div>
        )
    }
}

export default Index;