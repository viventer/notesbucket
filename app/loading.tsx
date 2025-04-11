"use client";

import HashLoader from "react-spinners/HashLoader";

export default function loading() {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <HashLoader color="#ffffff" loading={true} size={50} />
    </div>
  );
}
