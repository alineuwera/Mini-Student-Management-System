type Props = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ ...props }: Props) {
  return (
    <input
      {...props}
      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}
