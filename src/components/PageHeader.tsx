interface PageHeaderProps {
  title: string;
}

export default function PageHeader({ title }: PageHeaderProps) {
  return (
    <h1 className="text-2xl font-bold text-green-700">
      {title}
    </h1>
  );
} 