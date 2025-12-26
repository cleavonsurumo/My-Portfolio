import "/public/assets/css/vendors/bootstrap.min.css"
import "/public/assets/css/vendors/swiper-bundle.min.css"
import "/public/assets/css/vendors/carouselTicker.css"
import "/public/assets/css/vendors/magnific-popup.css"
import "/public/assets/fonts/remixicon/remixicon.css"
import "/public/assets/css/main.css"

import type { Metadata } from "next"
import { Urbanist, Playfair_Display } from "next/font/google"

const urbanist = Urbanist({
	weight: ['300', '400', '500', '600', '700'],
	subsets: ['latin'],
	variable: "--font-urbanist",
	display: 'swap',
})
const playfair_display = Playfair_Display({
	weight: ['400', '500', '600', '700'],
	subsets: ['latin'],
	variable: "--font-playfair",
	display: 'swap',
})

export const metadata: Metadata = {
	title: "Cleavon Surumo",
	description: "Cleavon - Personal Portfolio",
	icons: {
			icon: '/assets/imgs/home-page-2/template/favicon.svg',
			shortcut: '/assets/imgs/home-page-2/template/favicon.svg',
			apple: '/assets/imgs/home-page-2/template/favicon.svg',
	},

}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en" data-bs-theme="dark" className={`${urbanist.variable} ${playfair_display.variable} zelio`}>
			<head>
				<link rel="preload" href="/assets/fonts/dmmono-regular-webfont.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
				<link rel="preload" href="/assets/fonts/dmmono-medium-webfont.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
				<link rel="preload" href="/assets/fonts/dmmono-mediumitalic-webfont.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
				<link rel="icon" href="/assets/imgs/home-page-2/template/favicon.svg" />
			</head>
			<body>{children}</body>
		</html>
	)
}
