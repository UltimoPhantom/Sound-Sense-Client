import video1 from "../assets/v1.mp4";
import video2 from "../assets/v3.mp4";

const HeroSection = () => {
  return (
    <div className="flex flex-col items-center mt-6 lg:mt-20">
      <h1 className="text-4xl sm:text-6xl lg:text-7xl text-center tracking-wide">
        Unlock Your Voice with 
        <span className="bg-gradient-to-r from-pink-500 to-purple-700 text-transparent bg-clip-text">
          {<br></br>}
          Confidence
        </span>
      </h1>
      <p className="mt-10 text-lg text-center text-neutral-500 max-w-4xl">
        Empower speech development through personalized learning! Our platform assists students with speech disorders to improve pronunciation, build confidence, and enhance communication skills. Start your journey to clearer speech 
        <span className="bg-gradient-to-r from-pink-500 to-purple-700 text-transparent bg-clip-text"> from today!</span>
      </p>
      <div className="flex justify-center my-10">
        <a
          href="#"
          className="bg-gradient-to-r from-pink-500 to-purple-700 py-3 px-4 mx-3 rounded-md"
        >
          Let's Begin your Journey!
        </a>
      </div>

      <div className="flex mt-10 justify-center">
        <div className="flex justify-center items-center space-x-20">
          <video
            autoPlay
            loop
            muted
            className="rounded-lg w-96 h-64 border border-pink-500 shadow-sm shadow-purple-700"
          >
            <source src={video1} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <video
            autoPlay
            loop
            muted
            className="rounded-lg w-96 h-64 border border-pink-500 shadow-sm shadow-purple-700"
          >
            <source src={video2} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
