import "/public/assets/css/vendors/bootstrap.min.css"
import "/public/assets/css/vendors/swiper-bundle.min.css"
import "/public/assets/css/vendors/carouselTicker.css"
import "/public/assets/css/vendors/magnific-popup.css"
import "/public/assets/fonts/remixicon/remixicon.css"
import "/public/assets/css/main.css"

import type { Metadata } from "next"
import { Urbanist, Playfair_Display, DM_Mono } from "next/font/google"

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
const dmMono = DM_Mono({
	weight: ['300', '400', '500'],
	subsets: ['latin'],
	variable: "--font-dm-Mono",
	display: 'swap',
})
export const metadata: Metadata = {
	title: "Cleavon Surumo",
	description: "Cleavon - Personal Portfolio",
	icons: {
		icon: '/assets/imgs/home-page-2/hero-1/profile-pic.png',
		shortcut: '/assets/imgs/home-page-2/hero-1/profile-pic.png',
		apple: '/assets/imgs/home-page-2/hero-1/profile-pic.png',
	},

}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en" data-bs-theme="dark" className={`${dmMono.variable} ${urbanist.variable} ${playfair_display.variable} zelio`}>
			<head>
				<link rel="icon" href="/assets/imgs/home-page-2/hero-1/profile-pic.png" />
			</head>
			<body>{children}</body>
		</html>
	)
}
