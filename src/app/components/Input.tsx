type Props = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ ...props }: Props) {
  return (
    <input
      {...props}
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
    />
  );
}
