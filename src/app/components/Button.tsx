type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

export function Button({ children, ...props }: Props) {
  return (
     <button
      {...props}
      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors duration-200 disabled:bg-green-400 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}
