function Footer() {
    return (
      <footer className="w-full bg-gray-800 text-white py-4 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} PollyGlot Translator. All rights reserved.
        </p>
        <p className="text-sm">
          Built with ❤️ using OpenAI API.
        </p>
      </footer>
    );
  }
  
  export default Footer;
  