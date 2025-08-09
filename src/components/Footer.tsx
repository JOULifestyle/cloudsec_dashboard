export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 text-center text-sm text-gray-600 dark:text-gray-300 py-4">
      &copy; {new Date().getFullYear()} CloudSec Platform. All rights reserved.
    </footer>
  );
}
