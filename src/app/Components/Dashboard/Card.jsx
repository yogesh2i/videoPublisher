import Link from 'next/link'

export default function Card({link,svg,title,description}) {
  return (
    <Link href={link}
               className="group bg-white rounded-3xl shadow-xl p-12 flex flex-col items-center justify-center text-center 
                      border border-gray-200 transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:scale-102 
                      hover:shadow-2xl hover:border-blue-500 hover:bg-gradient-to-br from-white to-blue-50 animate-fade-in delay-100">
               {svg}
                <h3 className="text-3xl font-extrabold text-blue-700 mb-3">{title}</h3>
                <p className="text-gray-600 text-base leading-relaxed">{description}</p>
            </Link>
  )
}
