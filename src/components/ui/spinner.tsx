export default function Spinner() {
  return (
    <div className="flex justify-center items-center overflow-hidden h-full">
      <div
        className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-current border-r-transparent text-primary align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
        role="status"
      ></div>
    </div>
  );
}
