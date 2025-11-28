import Layout from "@/components/layout/Layout"
import Home2 from "@/sections/Home2"
import Contact2 from "@/sections/Contact2"

export default function Home() {
    return (
        <Layout headerStyle={1} footerStyle={1}>
            <Home2 />
            <Contact2 />
        </Layout>
    )
}