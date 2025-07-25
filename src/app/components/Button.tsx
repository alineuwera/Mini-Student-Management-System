type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

export function Button({ children, ...props }: Props) {
  return (
    <button
      {...props}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
    >
      {children}
    </button>
  );
}
