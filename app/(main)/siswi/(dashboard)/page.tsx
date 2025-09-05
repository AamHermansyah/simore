import React from 'react'
import { RiScanLine } from "@remixicon/react";
import { StatsGrid } from "../../_components/stats-grid";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Graph from '../_components/graph';
import { ComplianceChart } from '../_components/compliance-chart';

function SiswiDashboardPage() {
  return (
    <>
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Halo, Jane Doe!</h1>
        <p className="text-sm text-muted-foreground">
          Here&rsquo;s an overview of your contacts. Manage or create new
          ones with ease!
        </p>
      </div>

      <Card className="gap-1 max-w-xs from-primary to-primary">
        <CardHeader>
          <CardTitle className="text-primary-foreground">Poin</CardTitle>
        </CardHeader>
        <CardContent>
          <span className="text-4xl font-bold text-primary-foreground">1.000 XP</span>
        </CardContent>
      </Card>

      <StatsGrid
        className="lg:grid-cols-3"
        stats={[
          {
            title: "Minggu Ke",
            value: "10",
            icon: <RiScanLine size={20} aria-hidden="true" />,
          },
          {
            title: "Kepatuhan",
            value: "90%",
            icon: <RiScanLine size={20} aria-hidden="true" />,
          },
          {
            title: "Tidak Melapor",
            value: "2x",
            icon: <RiScanLine size={20} aria-hidden="true" />,
          },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 xl:col-span-7">
          <Graph />
        </div>
        <div className="lg:col-span-6 xl:col-span-5">
          <ComplianceChart />
        </div>
      </div>
    </>
  );
}

export default SiswiDashboardPage;