import Layout from "@/components/layout/Layout"
import Blog1 from "@/components/sections/Blog1"
import Brands1 from "@/components/sections/Brands1"
import Contact2 from "@/components/sections/Contact2"
import Home2 from "@/components/sections/Home2"
import Projects1 from "@/components/sections/Projects1"
import Service2 from "@/components/sections/Service1"
import Skills2 from "@/components/sections/Skills2"
import Static1 from "@/components/sections/Static1"
import Resume1 from "@/components/sections/Resume1"
import Testimonials1 from "@/components/sections/Testimonials1"

export default function Home() {

	return (
		<>
			<Layout headerStyle={1} footerStyle={1}>
				<Home2 />
				<Static1 />
				<Service2 />
				<Projects1 />
				<Resume1 />
				<Skills2 />
				<Brands1 />
				<Testimonials1 />
				<Blog1 />
				<Contact2 />
			</Layout>
		</>
	)
}