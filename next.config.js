// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        remotePatterns: [
            { hostname: 'images.unsplash.com' },
            { hostname: 'api.nasa.gov' },
            { hostname: 'www.nasa.gov' },
            { hostname: 'blogs.nasa.gov' },
            { hostname: 'spacexdata.com' },
            { hostname: 'i0.wp.com' },
            { hostname: 'spacenews.com' },
            { hostname: 'www.nasaspaceflight.com' },
            { hostname: 'apod.nasa.gov' },
            { hostname: 'www.spxdaily.com' },
            { hostname: 'www.youtube.com' },
            { hostname: 'img.youtube.com' },
            { hostname: 'www.esa.int' },
            { hostname: 'spacepolicyonline.com' },
            { hostname: 'spaceflightnow.com' }
        ]
    },
    experimental: {
        serverActions: {
            allowedOrigins: ['localhost:3000']
        }
    }
};
module.exports = nextConfig;
