import Link from 'next/link';
import Image from 'next/image';

const CategoryCard = ({ category, userId }) => {
  return (
    <div className="bg-gray-800 text-white shadow-lg rounded-lg overflow-hidden transition-transform duration-300 transform hover:scale-105 hover:shadow-2xl">
      <div className="px-6 py-4">
        <h2 className="text-2xl font-bold text-white mb-4">{category.name}</h2>
        <div className="mt-2">
          <h3 className="text-xl font-semibold text-gray-300 mb-3">Courses:</h3>
          <ul>
            {category.courses.map(course => (
              <li key={course.id} className="mb-6">
                <Link href={`/course/${course.id}`}>
                  <p className="block bg-gray-900 hover:bg-gray-700 rounded-lg p-4 transition duration-300 transform hover:translate-x-1 hover:shadow-md">
                    <div className="mb-4">
                      <Image
                        src={course.thumbnail}
                        alt={course.name}
                        className="object-cover rounded-lg w-full h-60" // Adjust width and height as needed
                        width={500} // Set width to 500 for larger display
                        height={300} // Set height to 300 for larger display
                      />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-yellow-400 mb-2">{course.name}</h4>
                      <p className="text-sm text-gray-200 mb-4">{course.description}</p>
                      <div className="flex items-center justify-between text-gray-400">
                        <span className="text-sm">{course.courseLevel}</span>
                        <span className="text-xs">{course.publishDate}</span>
                      </div>
                    </div>
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
