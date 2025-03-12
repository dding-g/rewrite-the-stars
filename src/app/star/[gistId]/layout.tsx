export default function GistLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="antialiased mx-auto max-w-[1200px] px-8 @max-5xl:px-6 py-10">
      {children}
    </div>
  );
}
