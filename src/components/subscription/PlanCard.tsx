import { Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PlanCardProps {
  id: string;
  nameAr: string;
  descriptionAr: string;
  price: number;
  features: string[];
  isSelected: boolean;
  onSelect: (id: string) => void;
  isPopular?: boolean;
}

export default function PlanCard({
  id,
  nameAr,
  descriptionAr,
  price,
  features,
  isSelected,
  onSelect,
  isPopular,
}: PlanCardProps) {
  return (
    <Card
      className={`relative cursor-pointer transition-all hover:shadow-lg ${
        isSelected ? "ring-2 ring-primary shadow-lg" : ""
      }`}
      onClick={() => onSelect(id)}
    >
      {isPopular && (
        <Badge className="absolute -top-3 right-4 bg-gradient-primary">
          الأكثر شعبية
        </Badge>
      )}
      <CardHeader>
        <CardTitle className="text-2xl">{nameAr}</CardTitle>
        <CardDescription className="text-base">{descriptionAr}</CardDescription>
        <div className="mt-4">
          <span className="text-4xl font-bold">{price}</span>
          <span className="text-muted-foreground"> ريال/شهر</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          variant={isSelected ? "default" : "outline"}
          className="w-full"
          type="button"
        >
          {isSelected ? "الباقة المختارة" : "اختر هذه الباقة"}
        </Button>
        <div className="space-y-3 pt-4 border-t">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
