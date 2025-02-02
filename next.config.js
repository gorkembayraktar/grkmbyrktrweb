/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        SITE_URL: process.env.NODE_ENV === 'production' 
            ? process.env.SITE_URL
            : 'http://localhost:3000'
    }
}

module.exports = nextConfig 