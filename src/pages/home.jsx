import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const Home = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <NavBar />
            <div className="flex-grow p-4 flex flex-col justify-center items-center text-center">
                <h1 className="text-3xl font-bold text-pnk-600">
                    Bienvenido a Dress Shopy
                </h1>
                <p className="mt-2 text-gray-600">
                    Encuentra la mejor ropa aquí.
                </p>
            </div>
            <Footer />
        </div>
    );
};

export default Home;