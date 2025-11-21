import { Check } from "lucide-react";

interface Step {
  number: number;
  title: string;
}

interface RegistrationStepsProps {
  currentStep: number;
}

const steps: Step[] = [
  { number: 1, title: "إنشاء الحساب" },
  { number: 2, title: "اختيار الباقة" },
  { number: 3, title: "معلومات المتجر" },
  { number: 4, title: "معلومات المالك" },
  { number: 5, title: "معلومات التواصل" },
];

export default function RegistrationSteps({ currentStep }: RegistrationStepsProps) {
  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                  currentStep > step.number
                    ? "bg-primary text-primary-foreground"
                    : currentStep === step.number
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {currentStep > step.number ? (
                  <Check className="h-6 w-6" />
                ) : (
                  step.number
                )}
              </div>
              <span
                className={`mt-2 text-sm font-medium ${
                  currentStep >= step.number
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-1 flex-1 mx-4 rounded transition-all ${
                  currentStep > step.number ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
