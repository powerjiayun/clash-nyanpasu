import { useTranslation } from "react-i18next";
import DataPanel from "@/components/dashboard/data-panel";
import HealthPanel from "@/components/dashboard/health-panel";
import ProxyShortcuts from "@/components/dashboard/proxy-shortcuts";
import ServiceShortcuts from "@/components/dashboard/service-shortcuts";
import Grid from "@mui/material/Grid2";
import { BasePage } from "@nyanpasu/ui";

export const Dashboard = () => {
  const { t } = useTranslation();

  return (
    <BasePage title={t("Dashboard")}>
      <Grid container spacing={2}>
        <DataPanel />

        <HealthPanel />

        <ProxyShortcuts />

        <ServiceShortcuts />
      </Grid>
    </BasePage>
  );
};

export default Dashboard;
