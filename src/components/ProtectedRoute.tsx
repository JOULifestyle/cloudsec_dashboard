import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../lib/useUser";

interface Props {
  children: React.ReactElement;
}

export default function ProtectedRoute({ children }: Props) {
  const { user, loading } = useUser();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
