import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";
import SearchPanel from "../components/SearchPanel.tsx";
import SearchResults from "../components/SearchResults.tsx";

const HomePage = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-grow flex flex-col md:flex-row">
      <SearchPanel />
      <SearchResults />
    </main>
    <Footer />
  </div>
);

export default HomePage;
