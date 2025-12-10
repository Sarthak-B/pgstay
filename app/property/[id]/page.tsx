import PropertyDetailsContent from "@/components/property-details-content"

interface PropertyPageProps {
  params: Promise<{ id: string }>
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { id } = await params
  return <PropertyDetailsContent propertyId={id} />
}
