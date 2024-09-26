import { collegeLinks, contactLinks } from "../constants";



const Footer = () => {
  return (
    <footer className="mt-20 border-t py-10 border-neutral-700">
      {/* Outer container with increased margin from left and right */}
      <div className="mx-4 lg:ml-[23rem] lg:mr-[10rem]">
        {/* Two equal-width divisions */}
        <div className="grid grid-cols-2 gap-2">
          {/* First Column */}
          <div>
            <h3 className="text-md font-semibold mb-4">College Information</h3>
            <ul className="space-y-2">
              {collegeLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-neutral-300 hover:text-white"
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Second Column */}
          <div>
            <h3 className="text-md font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              {contactLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-neutral-300 hover:text-white"
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
