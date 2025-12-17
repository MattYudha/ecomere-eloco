
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Authentication is now handled by middleware
  return <>{children}</>;
}
