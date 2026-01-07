import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/API/APIClient";

const MonthlySummary = ({ month, year }) => {
    
    const useMonthlySummary = (month, year) => {
        return useQuery({
            queryKey: ["monthlySummary", month, year],
            queryFn: async () => {
                const response = await api.post("/transactions/monthlySummary", {
                    month,
                    year,
                });
                return response.data;
            },
        });
    };
    const { data, isLoading } = useMonthlySummary(month, year);

  if (isLoading) {
    return <div className="grid grid-cols-2 gap-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="animate-pulse h-24" />
      ))}
    </div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {data.summary.map((item) => (
        <Card key={item._id}>
          <CardHeader>
            <CardTitle className="text-base">{item._id}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {item.totals.map((t) => (
              <div key={t.type} className="flex justify-between items-center">
                <Badge variant={t.type === "income" ? "secondary" : "destructive"}>
                  {t.type}
                </Badge>
                <span className="font-semibold">${t.totalAmmount}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MonthlySummary;
