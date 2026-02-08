import { useParams, useNavigate, Navigate } from "react-router-dom";
import { getCalculationById } from "@/utils/storage";
import { ResultsPage } from "@/components/ResultsPage";

export function HistoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const entry = id ? getCalculationById(id) : undefined;

  if (!entry) {
    return <Navigate to="/" replace />;
  }

  return (
    <ResultsPage
      result={entry.result}
      restaurantName={entry.restaurantName}
      createdAt={entry.createdAt}
      onBack={() => navigate("/")}
    />
  );
}
