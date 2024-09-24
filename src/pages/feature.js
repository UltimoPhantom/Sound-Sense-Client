import { features } from "../constants";

const FeatureSection = () => {
  return (
    <div className="relative mt-20 border-b border-neutral-800 min-h-[800px]">
      <div className="text-center">
        <h2 className="text-3xl sm:text-5xl lg:text-6xl mt-10 lg:mt-20 tracking-wide">
          <span className="bg-gradient-to-r from-pink-500 to-purple-700  text-transparent bg-clip-text">
            Features
          </span>
        </h2>
      </div>

      <div className="container mx-auto flex flex-wrap justify-center gap-6 mt-10 lg:mt-20">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="w-full sm:w-1/2 lg:w-1/3 p-4"
          >
            <div className="bg-neutral-900 shadow-lg hover:shadow-10xl transition-shadow duration-300 rounded-lg p-6">
              <div>
                <h5 className="mt-1 mb-4 text-2xl font-semibold text-white">
                  {feature.text}
                </h5>
                <p className="text-md text-neutral-400 mb-6">
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureSection;
