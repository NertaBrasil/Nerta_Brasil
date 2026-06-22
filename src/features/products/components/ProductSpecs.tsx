import { Badge } from "@/shared/components/ui/Badge";

type ProductSpecsProps = {
  dilution: string | null;
  attributes: string[];
};

export function ProductSpecs({ dilution, attributes }: ProductSpecsProps) {
  if (!dilution && attributes.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {dilution && (
        <Badge tone="blue" solid>
          {dilution}
        </Badge>
      )}
      {attributes.map((attribute) => (
        <Badge key={attribute} tone="teal">
          {attribute}
        </Badge>
      ))}
    </div>
  );
}
