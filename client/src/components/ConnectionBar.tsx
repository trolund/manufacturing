type ConnectionBarProps = {
  isconnected: boolean;
};

export default function ConnectionBar({ isconnected }: ConnectionBarProps) {
  return (
    <>
      {isconnected ? (
        <p className="p-5 text-green-500">Connected</p>
      ) : (
        <p className="p-5 text-red-500">Not connected</p>
      )}
    </>
  );
}
