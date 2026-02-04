export default function About() {
  return (
    <div className="bg-white py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          About Us
        </h1>
        <div className="prose prose-blue max-w-none text-gray-600 space-y-4">
          <p>
            Welcome to Knit Info. Our directory is a powerful and effective platform for advertising for suppliers of all kinds of products, process & services to the knitwear industry, helps in exchange of information, providing links to various other services relevant to this industry.
          </p>
          <p>
            It is also an effective sourcing tool for various requirements related to the textile industry.
          </p>
          <p>
            Available both as a printed directory and an online digital portal, Knit Info ensures easy access to information and greater reach among the business community.
          </p>
          <p className="font-semibold text-lg text-blue-900 mt-8">
            Discover. Learn. Connect. Grow.
          </p>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Our Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <span className="text-blue-600 font-semibold">April-2007</span>
              <h3 className="text-lg font-medium text-gray-900 mt-2">Knit Info Launched</h3>
              <p className="text-gray-600 mt-2">Launched by EX.M.L.A, marking the beginning of our journey.</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <span className="text-blue-600 font-semibold">Milestone</span>
              <h3 className="text-lg font-medium text-gray-900 mt-2">Office Opening</h3>
              <p className="text-gray-600 mt-2">Knit Info Office Opened By Tripur Garments Head.</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <span className="text-blue-600 font-semibold">Recognition</span>
              <h3 className="text-lg font-medium text-gray-900 mt-2">Honourable Meeting</h3>
              <p className="text-gray-600 mt-2">Meeting Honourable Dhayanithi Maran Sir M.P.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
