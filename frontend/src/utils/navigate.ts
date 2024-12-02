import { useNavigate } from "react-router-dom";

export const navigate = (
  path: string,
  state?: any,
  navigator?: ReturnType<typeof useNavigate>
) => {
  if (!navigator) {
    console.error("Navigator function is required for navigation");
    return;
  }
  navigator(path, { state });
};
