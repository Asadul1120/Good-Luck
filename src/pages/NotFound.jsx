import { Link } from "react-router-dom";
import notfound from "../assets/NotFound.jpeg";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <img
        src={notfound}
        alt="Not Found"
        className="w-full max-w-md mb-6"
      />
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 text-center">
        404 - Not Found
      </h1>
      <p className="text-gray-600 mb-6 text-center">
        The requested resource was not found on this server.
      </p>
      <Link
        to="/"
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
