"use client";
import { getEmbedUrl } from "@/utils/helper";

export default function MomentsList({ data }) {
  return (
    <>
      <li
        className="bg-blue-50 border border-blue-200 rounded-xl p-4 px-6 mb-3 flex items-center gap-4 transition-all duration-200 cursor-pointer hover:bg-blue-100 hover:translate-x-1 hover:shadow-sm"
        onClick={() => data.setSelectedIdx(data.idx)}
        data-start="15"
        data-end="55"
      >
        <span className="font-semibold text-gray-800">
          {data.item.start} - {data.item.end}
        </span>
        <p className="text-gray-700 text-sm flex-grow">
          {data.item.description}
        </p>
      </li>
      {data.selectedIdx === data.idx && (
        <div className="relative w-full pb-[56.25%] h-0 mb-8 rounded-xl overflow-hidden shadow-lg">
          <iframe
            className="absolute top-0 left-0 w-full h-full border-none"
            src={getEmbedUrl(data.url, data.item.start)}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </>
  );
}
