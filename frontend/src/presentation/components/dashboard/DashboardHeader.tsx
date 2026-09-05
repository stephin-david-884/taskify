import { useAuth } from "../../../hooks/useAuth";

const DashboardHeader = () => {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const isLead = user?.role === "LEAD";

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl lg:text-3xl">
            {getGreeting()}, {user?.name || "User"}
          </h1>
          <span
            className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${
              isLead
                ? "bg-emerald-100 text-emerald-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {isLead ? "Team Lead" : "Team Member"}
          </span>
        </div>
        <p className="mt-1 text-sm text-neutral-500">
          {isLead
            ? "Here's an overview of your team's task progress and performance."
            : "Here's what's assigned to you and happening with your tasks today."}
        </p>
      </div>
    </div>
  );
};

export default DashboardHeader;
