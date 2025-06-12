interface InputErrorProps {
  message?: string;
}

export function InputError({ message }: InputErrorProps) {
  if (!message) return null;
  return <p className="text-red-600 text-sm mt-1">{message}</p>;
}
