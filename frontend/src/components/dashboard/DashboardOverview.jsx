import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/API/APIClient";
import useAuthStore from "@/lib/store/authStore";

const DashboardOverview = () => {
    const { user }=useAuthStore()
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-overview"],
    queryFn: async () => {
        if (user?.role !== "admin") return {};
      const res = await api.get("/transactions/overview");
      return res.data;
    },
    enabled: user?.role === "admin",
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {user?.role === "admin" && data && (
      <Card>
        <CardHeader>
          <CardTitle>Total Users</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold">
          {data.totalUsers || 0}
        </CardContent>
      </Card>
    )}

    {
        user?.role === "admin" && data && (
      <Card>
        <CardHeader>
          <CardTitle>Total Income</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold text-green-600">
          ${data.totalIncome[0]?.total || 0}
        </CardContent>
      </Card>
        )
    }

    {
        user?.role === "admin" && data && (

      <Card>
        <CardHeader>
          <CardTitle>Total Expenses</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold text-red-600">
          ${data.totalExpenses[0]?.total || 0}
        </CardContent>
      </Card>
        )
    }

    </div>
  );
};

export default DashboardOverview;
