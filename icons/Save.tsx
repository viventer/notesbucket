export default function Save({ className }: { className?: string }) {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 24 24"
      id="save-left"
      data-name="Flat Color"
      xmlns="http://www.w3.org/2000/svg"
      className={`icon flat-color ${className}`}
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <path
          opacity="0.4"
          id="primary"
          d="M3.29,6.29l4-4A1,1,0,0,1,8,2H19a2,2,0,0,1,2,2V20a2,2,0,0,1-2,2H5a2,2,0,0,1-2-2V7A1,1,0,0,1,3.29,6.29Z"
        ></path>
        <path
          id="secondary"
          d="M8,14h8a1,1,0,0,1,1,1v7H7V15A1,1,0,0,1,8,14Zm6-6h2a1,1,0,0,0,0-2H14a1,1,0,0,0,0,2Z"
        ></path>
      </g>
    </svg>
  );
}
