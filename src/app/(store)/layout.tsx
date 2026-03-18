import Header from "../components/Header";
import SubNavbar from "../components/SubNavbar";
import Footer from "../components/Footer";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <SubNavbar />
      {children}
      <Footer />
    </>
  );
}
