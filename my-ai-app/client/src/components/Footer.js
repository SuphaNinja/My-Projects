export default function Footer () {

    return (
        <footer class="bg-gray-900 text-white py-8">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div class="col-span-1 md:col-span-2">
                        <h2 class="text-3xl font-bold mb-4">GoalFitPro</h2>
                        <p class="text-gray-400">Your fitness journey starts here.</p>
                        <p class="mt-4">123 Fitness Avenue, New York, NY 10001</p>
                        <p>info@goalfitpro.com</p>
                    </div>
                    <div class="col-span-1">
                        <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul class="space-y-2">
                            <li><a href="#" class="text-gray-400 hover:text-white transition-colors duration-300">Home</a></li>
                            <li><a href="#" class="text-gray-400 hover:text-white transition-colors duration-300">About Us</a></li>
                            <li><a href="#" class="text-gray-400 hover:text-white transition-colors duration-300">Services</a></li>
                            <li><a href="#" class="text-gray-400 hover:text-white transition-colors duration-300">Blog</a></li>
                            <li><a href="#" class="text-gray-400 hover:text-white transition-colors duration-300">Contact Us</a></li>
                        </ul>
                    </div>
                    <div class="col-span-1">
                        <h3 class="text-lg font-semibold mb-4">Connect With Us</h3>
                        <ul class="flex space-x-4">
                            <li><a href="#" class="text-gray-400 hover:text-white transition-colors duration-300"><i class="fab fa-facebook-f"></i></a></li>
                            <li><a href="#" class="text-gray-400 hover:text-white transition-colors duration-300"><i class="fab fa-twitter"></i></a></li>
                            <li><a href="#" class="text-gray-400 hover:text-white transition-colors duration-300"><i class="fab fa-instagram"></i></a></li>
                            <li><a href="#" class="text-gray-400 hover:text-white transition-colors duration-300"><i class="fab fa-linkedin-in"></i></a></li>
                        </ul>
                    </div>
                    <div class="col-span-1">
                        <h3 class="text-lg font-semibold mb-4">Subscribe to Our Newsletter</h3>
                        <form action="#" class="flex">
                            <input type="email" placeholder="Your email" class="px-4 py-2 w-full rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                                <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300">Subscribe</button>
                        </form>
                    </div>
                </div>
                <div class="border-t border-gray-800 mt-8 pt-4 text-sm text-gray-400 flex justify-between items-center">
                    <div>
                        <p>&copy; 2024 GoalFitPro. All rights reserved.</p>
                        <p>Terms of Service | Privacy Policy</p>
                    </div>
                    <div class="space-x-4">
                        <a href="#" class="text-gray-400 hover:text-white transition-colors duration-300"><i class="fab fa-twitter"></i></a>
                        <a href="#" class="text-gray-400 hover:text-white transition-colors duration-300"><i class="fab fa-facebook-f"></i></a>
                        <a href="#" class="text-gray-400 hover:text-white transition-colors duration-300"><i class="fab fa-instagram"></i></a>
                        <a href="#" class="text-gray-400 hover:text-white transition-colors duration-300"><i class="fab fa-linkedin-in"></i></a>
                    </div>
                </div>
            </div>
        </footer>


    )
}